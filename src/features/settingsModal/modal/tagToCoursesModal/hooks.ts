import { atom } from 'jotai';

import { useSimpleModal } from '@/hooks/modal';

const useTagToCoursesModalAtom = atom<boolean>(false);

export const useTagToCoursesModal = () =>
  useSimpleModal(useTagToCoursesModalAtom);
