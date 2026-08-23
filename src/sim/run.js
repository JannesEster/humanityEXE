import { mulberry32, mixSeed } from './rng.js';
import { reduce } from './reduce.js';

export function rngFor(state) {
  const salt = state.turn * 2 + (state.screen === 'audit' ? 1 : 0);
  return mulberry32(mixSeed(state.seed, salt));
}

export function apply(state, action) {
  return reduce(state, action, rngFor(state)).state;
}
