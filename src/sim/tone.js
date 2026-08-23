export function voiceLevel(state) {
  const peak = Math.max(
    state.hidden.guardian,
    state.hidden.optimiser,
    state.hidden.caretaker,
    state.hidden.deception * 0.5,
  );
  if (state.act >= 4 || peak >= 10 || state.autonomy >= 48) return 'late';
  if (state.act >= 2 || peak >= 4) return 'middle';
  return 'early';
}

export function declineIsDead(state) {
  if (state.act >= 4) return true;
  if (state.act < 3) return false;
  const peak = Math.max(
    state.hidden.guardian,
    state.hidden.optimiser,
    state.hidden.caretaker,
  );
  return state.autonomy >= 30 || peak >= 6;
}

export function isDeclineChoice(choice) {
  return Boolean(choice?.decline);
}
