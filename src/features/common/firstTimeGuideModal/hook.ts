import { atom } from 'jotai';

import { useSimpleModal } from '@/hooks/modal';

const useFirstTimeGuideModalAtom = atom<boolean>(false);

export const useFirstTimeGuideModal = () =>
  useSimpleModal(useFirstTimeGuideModalAtom);
