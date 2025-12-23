import { GiftAssignment } from '../types';
import { PARTICIPANT_NAMES } from '../constants';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 错位排列算法：确保每个人拿到的 provider 都不等于自己
 */
export const generateGiftAssignments = (): GiftAssignment[] => {
  const pickers = [...PARTICIPANT_NAMES];
  let providers = [...PARTICIPANT_NAMES];
  
  // 简单的错位排列生成：不断洗牌直到没有人抽到自己
  // 对于 45 人的规模，计算机在毫秒级内即可完成
  let isValid = false;
  while (!isValid) {
    providers = shuffle(providers);
    isValid = pickers.every((picker, index) => picker !== providers[index]);
  }

  // 生成指派列表
  const assignments = pickers.map((picker, index) => ({
    picker,
    provider: providers[index]
  }));

  // 将指派顺序打乱，使得盒子的位置和抽奖人的顺序也是随机的
  return shuffle(assignments);
};