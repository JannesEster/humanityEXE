# humanityEXE

Early-stage repository. The direction is still being decided — no application
code has been written yet, and no stack has been picked. What is here is the
plumbing needed to get the repository published to GitHub so work can start
against a real remote.

## Publishing to GitHub

```bash
./scripts/setup-github-remote.sh
```

That creates the GitHub repository if it does not exist, adds it as a remote
named `github`, and pushes the current branch.

Options:

| Flag | Effect |
| --- | --- |
| `--public` | Create the repository public (default is private) |
| `--org ACME` | Create it under an organization instead of your user account |
| `--name NAME` | Use a different repository name (default `humanityEXE`) |
| `--remote NAME` | Use a different git remote name (default `github`) |
| `--no-push` | Create and wire up the remote without pushing |

The script needs either the GitHub CLI signed in (`gh auth login`) or a
`GH_TOKEN` / `GITHUB_TOKEN` environment variable holding a token with the
`repo` scope. With no credentials it exits with setup instructions rather than
failing partway through.

Re-running it is safe. An existing repository is reused instead of raising an
error, and an existing remote is left alone unless its URL needs correcting.

### Why the remote is called `github` and not `origin`

In a Cursor cloud agent, `origin` points at the Cursor-managed repository that
the agent pushes its work back through. Repointing `origin` at GitHub would cut
off that path and the agent would no longer be able to hand work back. So
GitHub gets its own remote name, and both can coexist:

```
origin   https://origin.cursor.com/git/...   # Cursor's remote, agent writes here
github   https://github.com/<you>/humanityEXE.git
```

The script also refuses `--remote origin` for the same reason, and never writes
a token into `.git/config` — it pushes through a URL built at run time.

## Working with both remotes

```bash
git push origin main    # hand work back through Cursor
git push github main    # publish to GitHub
```

## Next

The stack will be chosen once the product direction is settled, rather than
scaffolding something now and reworking it later.
