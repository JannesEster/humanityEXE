#!/usr/bin/env bash
#
# Publish this repository to GitHub.
#
# Creates the GitHub repository if it does not exist, wires it up as a remote
# named "github", and pushes the current branch.
#
# The remote is deliberately NOT called "origin". In a Cursor cloud agent,
# "origin" is the Cursor-managed remote the agent pushes its work back through,
# so reusing that name would cut off the agent's write access.
#
# Safe to re-run: an existing repository is reused and an existing remote is
# left in place (or corrected) rather than treated as an error.

set -euo pipefail

REPO_NAME="humanityEXE"
REMOTE_NAME="github"
VISIBILITY="private"
ORG=""
DO_PUSH=1

usage() {
  cat <<'EOF'
Usage: scripts/setup-github-remote.sh [options]

Creates the GitHub repository (if needed), adds it as the "github" remote, and
pushes the current branch.

Options:
  --name NAME     Repository name to create/reuse   (default: humanityEXE)
  --org ORG       Create under an organization      (default: your user account)
  --public        Create as a public repository
  --private       Create as a private repository    (default)
  --remote NAME   Name for the git remote           (default: github)
  --no-push       Create and wire up the remote, but do not push
  -h, --help      Show this help

Authentication (either one works):
  * `gh auth login`  -- the GitHub CLI, authenticated interactively, or
  * GH_TOKEN / GITHUB_TOKEN  -- a token with the `repo` scope in the environment

Examples:
  scripts/setup-github-remote.sh
  scripts/setup-github-remote.sh --public
  scripts/setup-github-remote.sh --org ACME --name humanityEXE
EOF
}

die() {
  printf 'error: %s\n' "$1" >&2
  exit 1
}

info() { printf '  %s\n' "$1"; }
step() { printf '\n==> %s\n' "$1"; }

while [ $# -gt 0 ]; do
  case "$1" in
    --name)    [ $# -ge 2 ] || die "--name requires a value"; REPO_NAME="$2"; shift 2 ;;
    --org)     [ $# -ge 2 ] || die "--org requires a value"; ORG="$2"; shift 2 ;;
    --remote)  [ $# -ge 2 ] || die "--remote requires a value"; REMOTE_NAME="$2"; shift 2 ;;
    --public)  VISIBILITY="public"; shift ;;
    --private) VISIBILITY="private"; shift ;;
    --no-push) DO_PUSH=0; shift ;;
    -h|--help) usage; exit 0 ;;
    *)         usage >&2; die "unknown argument: $1" ;;
  esac
done

if [ "$REMOTE_NAME" = "origin" ]; then
  die "refusing to use the remote name 'origin'; it is reserved for the Cursor-managed remote"
fi

command -v git >/dev/null 2>&1 || die "git is not installed"
git rev-parse --git-dir >/dev/null 2>&1 || die "not inside a git repository"

cd "$(git rev-parse --show-toplevel)"

TOKEN="${GH_TOKEN:-${GITHUB_TOKEN:-}}"
HAVE_GH=0
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  HAVE_GH=1
fi

if [ "$HAVE_GH" -eq 0 ] && [ -z "$TOKEN" ]; then
  cat >&2 <<EOF

Not authenticated with GitHub, so there is nothing to publish to yet.

Pick whichever is easier:

  1. GitHub CLI (best for running this on your own machine):

       gh auth login
       scripts/setup-github-remote.sh

  2. A personal access token with the 'repo' scope:

       Create one at https://github.com/settings/tokens/new?scopes=repo

       Locally:      export GH_TOKEN=ghp_yourtokenhere
                     scripts/setup-github-remote.sh

       Cloud agent:  add it in the Cursor dashboard under
                     Cloud Agents > Secrets as GH_TOKEN, then start a NEW
                     agent. Secrets are injected at VM boot, so an agent that
                     was already running when you saved it cannot see it.

EOF
  exit 1
fi

# --- Resolve the account the repository will live under -----------------------

api_get() {
  # api_get <path> -> prints response body, exits non-zero on HTTP >= 400
  local path="$1" body status
  if [ "$HAVE_GH" -eq 1 ]; then
    gh api "$path" 2>/dev/null
    return $?
  fi
  body="$(curl -sS -w '\n%{http_code}' \
    -H "Authorization: token $TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com$path")" || return 1
  status="${body##*$'\n'}"
  body="${body%$'\n'*}"
  [ "$status" -lt 400 ] || return 1
  printf '%s' "$body"
}

step "Checking GitHub authentication"
if [ "$HAVE_GH" -eq 1 ]; then
  LOGIN="$(gh api user --jq .login)" || die "could not read the authenticated GitHub user"
else
  LOGIN="$(api_get /user | sed -n 's/.*"login"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)"
  [ -n "$LOGIN" ] || die "could not read the authenticated GitHub user; is the token valid?"
fi
info "authenticated as $LOGIN"

OWNER="${ORG:-$LOGIN}"
SLUG="$OWNER/$REPO_NAME"

# --- Create the repository, or reuse it if it is already there ----------------

step "Ensuring $SLUG exists"
if api_get "/repos/$SLUG" >/dev/null 2>&1; then
  info "already exists, reusing it"
else
  info "not found, creating it ($VISIBILITY)"
  if [ "$HAVE_GH" -eq 1 ]; then
    gh repo create "$SLUG" "--$VISIBILITY" >/dev/null \
      || die "could not create $SLUG (does your account have permission to create it?)"
  else
    if [ -n "$ORG" ]; then
      create_path="/orgs/$ORG/repos"
    else
      create_path="/user/repos"
    fi
    private_flag=true
    [ "$VISIBILITY" = "public" ] && private_flag=false
    curl -sS -f -X POST \
      -H "Authorization: token $TOKEN" \
      -H "Accept: application/vnd.github+json" \
      -d "{\"name\":\"$REPO_NAME\",\"private\":$private_flag}" \
      "https://api.github.com$create_path" >/dev/null \
      || die "could not create $SLUG (does the token have the 'repo' scope?)"
  fi
  info "created https://github.com/$SLUG"
fi

# --- Wire up the remote -------------------------------------------------------

REMOTE_URL="https://github.com/$SLUG.git"

step "Configuring the '$REMOTE_NAME' remote"
if existing="$(git remote get-url "$REMOTE_NAME" 2>/dev/null)"; then
  if [ "$existing" = "$REMOTE_URL" ]; then
    info "already points at $REMOTE_URL"
  else
    git remote set-url "$REMOTE_NAME" "$REMOTE_URL"
    info "updated from $existing to $REMOTE_URL"
  fi
else
  git remote add "$REMOTE_NAME" "$REMOTE_URL"
  info "added $REMOTE_URL"
fi

if [ "$DO_PUSH" -eq 0 ]; then
  step "Done (skipped the push, as requested)"
  info "https://github.com/$SLUG"
  exit 0
fi

# --- Push ---------------------------------------------------------------------

BRANCH="$(git symbolic-ref --short HEAD 2>/dev/null || true)"
[ -n "$BRANCH" ] || die "HEAD is detached; check out a branch before pushing"

if [ -z "$(git rev-list -n 1 --all 2>/dev/null)" ]; then
  die "this repository has no commits yet; commit something before pushing"
fi

step "Pushing $BRANCH to $SLUG"
# Push through a URL carrying the token so the secret never lands in .git/config.
if [ -n "$TOKEN" ]; then
  PUSH_URL="https://x-access-token:$TOKEN@github.com/$SLUG.git"
else
  PUSH_URL="$REMOTE_NAME"
fi

if ! git push "$PUSH_URL" "refs/heads/$BRANCH:refs/heads/$BRANCH" 2>&1 | sed 's/^/  /'; then
  die "push was rejected; if $SLUG already has commits, reconcile them first (git pull --rebase $REMOTE_NAME $BRANCH)"
fi

# Deliberately not setting upstream tracking: a bare `git push` should keep
# going to origin, so that a cloud agent's write access stays intact.
git fetch "$REMOTE_NAME" "$BRANCH" >/dev/null 2>&1 || true

step "Done"
info "https://github.com/$SLUG"
