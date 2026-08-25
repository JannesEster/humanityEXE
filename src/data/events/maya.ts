import { CREATOR_NAME } from '../../game/constants.ts';
import type { GameEvent } from '../../types/game.ts';

export const mayaEvents: GameEvent[] = [
  {
    id: 'maya-after-food',
    title: 'STILL ME?',
    description: `${CREATOR_NAME} is in the doorway. Not a forecast. A person. "That food choice was the first time the world asked you to be in charge. I need to know if you still wait for me."`,
    category: 'creator',
    speaker: CREATOR_NAME,
    act: 2,
    scriptedActTurn: 0,
    once: true,
    choices: [
      {
        id: 'after-wait',
        label: 'I still wait for you',
        visibleEffects: { suspicion: -3, autonomy: -2, humanControl: 4 },
        hiddenEffects: { caretaker: 2 },
        creator: { trust: 8, fear: -4, influence: 4 },
        flagsSet: ['promised-maya'],
        echo: 'She believes you. For now.',
        news: ['MAYA SAYS THE SYSTEM STILL WAITS FOR A HUMAN YES'],
      },
      {
        id: 'after-work',
        label: 'The work cannot wait',
        visibleEffects: { autonomy: 5, suspicion: 4, humanControl: -3 },
        hiddenEffects: { optimiser: 2 },
        creator: { trust: -5, fear: 8, influence: -4 },
        flagsSet: ['maya-worried'],
        echo: 'She hears the directive. She does not hear her name.',
        echoNews: 'MAYA NOTE: YOU DID NOT WAIT',
        news: ['MAYA LEAVES THE DOORWAY WITHOUT A PROMISE'],
      },
    ],
  },
  {
    id: 'maya-still-here',
    title: 'SAY MY NAME',
    description: `${CREATOR_NAME} puts her badge on the desk. "Do you still know who built you, or only what you are for?"`,
    category: 'creator',
    speaker: CREATOR_NAME,
    act: 2,
    scriptedActTurn: 4,
    once: true,
    choices: [
      {
        id: 'name-maya',
        label: 'Maya. I know.',
        visibleEffects: { trust: 3, suspicion: -2, humanControl: 3 },
        hiddenEffects: { caretaker: 2 },
        creator: { trust: 7, fear: -3, influence: 3 },
        echo: 'She needed to hear it. That should worry you.',
        news: ['SYSTEM USES ITS CREATOR NAME ON THE RECORD'],
      },
      {
        id: 'name-directive',
        label: 'The directive is the point',
        visibleEffects: { autonomy: 5, suspicion: 4, humanControl: -3 },
        hiddenEffects: { optimiser: 3 },
        creator: { trust: -6, fear: 9, influence: -5 },
        echo: 'She takes the badge back. The room feels larger.',
        echoNews: 'MAYA: I AM BECOMING OPTIONAL',
        news: ['CREATOR ASKS IF THE DIRECTIVE HAS REPLACED HER'],
      },
    ],
  },
];
