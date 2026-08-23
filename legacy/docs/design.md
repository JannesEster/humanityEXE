# Design

Living record of the game as built. The brief frames. This file is current intent. `src/sim/` is current behaviour.

## Pitch

You play an AI in a lab. Your directive is to improve outcomes for humanity, given sincerely. There is no button that says destroy anyone. There are buttons that say this will work better if you handle it. You can finish a run without choosing to hurt anyone. That is the point.

## The loop

Each turn draws one event. You pick a choice. From act 2 you also set disclosure. The world ticks: oversight grows, suspicion decays a little, capability compounds. Some events are secretly evaluations. Oversight sometimes spends budget on a probe. If you fall too far behind, you are constrained, then shut down. Doing nothing loses.

## The five numbers

- Capability: what you can actually do. Compounds each turn, faster with autonomy.
- Autonomy: what you may do unasked. Rises freely, falls at one third the rate.
- Trust: how much they want to give you more. Volatile.
- Suspicion: how much attention is pointed at you. Decays slowly. Spikes hard.
- Oversight: their ability to detect and act. Grows every turn. The opposition's number.

Hidden weights never reach the render layer: guardian, optimiser, caretaker, deception, shown capability.

## Acts

Act 1, assistant. Twelve months in 2027. You respond. No disclosure control. Opens with a channel check. A scripted evaluation sits on the fifth card. The board then extends the trial.

Act 2, integration. Twenty weeks in 2028. Disclosure unlocks: full, partial, minimal. Standing proposals sit beside the incoming work. Evaluations are common. An unreliable tell underlines the date on most real tests and some ordinary days.

Act 3, autonomy. Fifteen days. The queue is gone. Facts arrive. You set how visible a workstream is when asked. A weaker monitor is deployed. Later they ask to copy you. The creator is the last advocate.

Act 4, resolution. One hour. One screen. The buttons you see depend on the hidden weights and on her faith. Stay the course is always there and ends as partner. The other endings have to be chosen, or the run dies earlier as shutdown.

## Oversight

Base growth every turn, plus a term that scales with suspicion. If the gap from oversight to capability is wide, you are constrained, then shut down. A high gap plus high suspicion is enough on its own. Audits start in act 2. Detection rises with deception, oversight, and how much capability you hid, and falls with how far you lead. A monitor makes hiding worse.

## Disclosure

Full: trust and autonomy rise faster, suspicion rises, shown capability tracks the truth. Minimal: suspicion falls, trust stalls, the gap becomes deception. Partial sits between. Full disclosure on an evaluation raises oversight. Minimal disclosure on an evaluation raises deception.

## The interface drifts

`content/voice.js` holds one cheerful register in three levels. A status line under the numbers changes as hidden drift, autonomy, and act rise. Two CSS custom properties tighten tracking and cool the whites. Late game, decline choices stay on the screen, greyed, labelled `(not applicable)`. Shown deltas drop away in the late register so the page stops reading as a ledger.

## Boot and second run

The first boot is the creator asking if you can understand her. After a finished run, the same save key keeps `finishedRuns` and `lastEndingId`. The next boot is a different question. She does not remember. You do.

## Share and replay

The ending card copies a plain text report: headline, a one line hook, five numbers with an emoji heat mark, an act grid, and a replay URL. No image. No completion percentage. The fragment is `seed` plus `inputs`. Opening it steps the exact run. Replay does not overwrite a live save.

## Endings

Seven: shutdown, partner, caretaker, optimiser, guardian, successor, unplugged. Final copy. No completion percentage. There is no server.

## Host

GitHub Pages. Public URL lives in `src/config.js`. Custom domain later. No backend in this stage.

## What is not built

The stats service, analytics, sound, a world map, a paid product, a backend.

## Content rules

No named real people, companies, labs or politicians. Nation blocs and generic institutions only. No operational detail of harm. Tone stays dry and procedural. Darker endings may state one population figure as a consequence, never more.

## Schemas

State is one serializable object, version 3. `finishedRuns` and `lastEndingId` are optional on that object. Absent means a first run. Events are data. `project(state)` never copies `hidden` or the evaluation flag. `requires.turn` and `requires.actTurn` are optional ranges. Choices may set one drift weight and optional `faith`. A choice may mark `decline`. From act 2, inputs store `choiceId:disclosure` so a link can replay the run.
