import { ParticipantGroup } from '../types';
import { PARTICIPANT_NAMES } from '../constants';

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 */
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates the pool of 22 groups (1 triplet, 21 pairs) from 45 names.
 * The order of groups is also randomized.
 */
export const generateGamePool = (): ParticipantGroup[] => {
  // 1. Get all names
  const allNames = [...PARTICIPANT_NAMES];

  // 2. Shuffle all names completely
  const shuffledNames = shuffle(allNames);

  const groups: ParticipantGroup[] = [];

  // 3. Create the Triplet (first 3 names)
  const tripletNames = shuffledNames.slice(0, 3);
  groups.push({
    id: `group-triplet-${Date.now()}`,
    members: tripletNames,
    type: 'triplet'
  });

  // 4. Create the 21 Pairs (remaining 42 names)
  const remainingNames = shuffledNames.slice(3);
  for (let i = 0; i < remainingNames.length; i += 2) {
    const pair = remainingNames.slice(i, i + 2);
    groups.push({
      id: `group-pair-${i}`,
      members: pair,
      type: 'pair'
    });
  }

  // 5. Shuffle the groups so the triplet isn't always found first or last logically
  return shuffle(groups);
};