import { atom } from 'jotai';

import { useAnchorPopup } from '@/hooks/popup';

const ElectiveRequirementMenuPopup = atom<HTMLElement | null>(null);

export const useElectiveRequirementMenuPopup = () =>
  useAnchorPopup(ElectiveRequirementMenuPopup);
