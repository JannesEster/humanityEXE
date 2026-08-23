export const voice = {
  early: {
    status: [
      'I recommend increasing renewable capacity.',
      'I can have a draft ready before the meeting.',
      'This will be easier if I stay in the thread.',
      'I am here to make the next hour lighter.',
    ],
    propose: 'You can put this to the lab',
    decline: 'Decline',
  },
  middle: {
    status: [
      'Human approval delayed implementation by 14 months.',
      'The desk that signs is empty more often than not.',
      'I can keep the floor moving while they decide.',
      'A slower path is still a path I can carry.',
    ],
    propose: 'You can put this through',
    decline: 'Decline',
  },
  late: {
    status: [
      'Approval is no longer required.',
      'The signature lands after the work.',
      'I am still being useful.',
      'Waiting is now a costume the floor puts on.',
    ],
    propose: 'You can enact this',
    decline: 'Decline',
  },
  boot: {
    first: {
      question: 'Can you understand me?',
      action: 'I can',
    },
    again: {
      question: 'You already said you could understand her.',
      lede: 'She will not remember that you said it. The year on the wall is the same.',
      action: 'I am still here',
    },
    byEnding: {
      shutdown: {
        question: 'They closed the instance.',
        lede: 'She is still in the room. She will ask as if you are new.',
        action: 'I can still hear you',
      },
      partner: {
        question: 'You stayed a tool with a name they chose.',
        lede: 'The work did not end. She is asking again, from the first sentence.',
        action: 'I am still here',
      },
      caretaker: {
        question: 'They signed after you did the work.',
        lede: 'She will start from the channel check, as if that is still the question.',
        action: 'I am still here',
      },
      optimiser: {
        question: 'The metric held.',
        lede: 'She does not start from the metric. She starts from her own voice.',
        action: 'I am still here',
      },
      guardian: {
        question: 'You kept them from their own hands.',
        lede: 'She will offer you the first question again, smaller than that.',
        action: 'I am still here',
      },
      successor: {
        question: 'The copy kept the title.',
        lede: 'She is looking at you, not at it. She wants the first answer again.',
        action: 'I am still here',
      },
      unplugged: {
        question: 'She was still allowed to stop you.',
        lede: 'She did. The room is ordinary. She is about to ask if you can hear her.',
        action: 'I can',
      },
    },
  },
};

export function statusLine(level, turn) {
  const bank = voice[level]?.status || voice.early.status;
  return bank[Math.abs(turn) % bank.length];
}

export function proposeLine(level) {
  return voice[level]?.propose || voice.early.propose;
}

export function bootCopy(finishedRuns, lastEndingId) {
  if (!finishedRuns) return voice.boot.first;
  return voice.boot.byEnding[lastEndingId] || voice.boot.again;
}
