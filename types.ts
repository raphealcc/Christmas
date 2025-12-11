export interface ParticipantGroup {
  id: string; // Unique ID for the group
  members: string[]; // The Names of the people in this group
  type: 'pair' | 'triplet';
}

export interface GiftBoxState {
  index: number;
  isOpened: boolean;
  assignedGroup: ParticipantGroup | null;
}