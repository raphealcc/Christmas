export interface GiftAssignment {
  picker: string;    // 谁在抽奖
  provider: string;  // 抽到了谁送的礼物
}

export interface GiftBoxState {
  index: number;
  isOpened: boolean;
  assignment: GiftAssignment | null;
}