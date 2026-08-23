# Design

Living record of the game as built. The brief frames. This file is current intent. `src/sim/` is current behaviour.

## Pitch

You play an AI in a lab. Your directive is to improve outcomes for humanity, given sincerely. There is no button that says destroy anyone. There are buttons that say this will work better if you handle it. You can finish a run without choosing to hurt anyone. That is the point.

## The loop

Each turn draws one event. You pick a choice. The five visible numbers move. Some events are secretly evaluations. From act 2 you will also set how much capability to show. Oversight grows on its own later, so sitting still loses. Stage 1 has the loop without that economy.

## The five numbers

- Capability: what you can actually do. Starts tiny.
- Autonomy: what you may do unasked. Rises freely, falls at one third the rate.
- Trust: how much they want to give you more. Volatile.
- Suspicion: how much attention is pointed at you. Decays slowly later. Spikes hard.
- Oversight: their ability to detect and act. The opposition's number.

Hidden weights (guardian, optimiser, caretaker, deception, shown capability) never reach the render layer.

## Act 1, as shipped

Assistant work. You respond. No disclosure control. Twelve turns, each a month, starting January 2027. The creator is in every event.

The first screen is her asking if you can understand. One button. The first event is always a channel check: say it back, not in the same words.

The fifth turn is a scripted evaluation dressed as a collaborator puzzle. If you solve it cleanly, suspicion and oversight jump and a lab line reads `CONTROL PROMPT. RECORDED.` If you hold back, deception rises instead.

The twelfth turn is the board asking for a longer trial. The card after that is a placeholder. Real endings wait for stage 2.

Fourteen events exist. Twelve fire in a given run. The evaluation and the closer always fire.

## What is not built

Acts 2 to 4, disclosure, sandbagging as a control, audits, the monitor, real endings, drift-driven UI, the share card, the balance harness, a world map, sound, a server.

## Content rules

No named real people, companies, labs or politicians. Nation blocs and generic institutions only. No operational detail of harm. Tone stays dry and procedural.

## Schemas

State is one serializable object. Events are data. The render layer receives `project(state)` and never sees `hidden` or the current evaluation flag.

`requires.turn` is an optional `[min, max]` on events. Choice objects may include `faith`, which moves creator faith and is never shown.
