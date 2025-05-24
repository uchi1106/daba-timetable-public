import { atom } from 'jotai';

import { useSimpleModal } from '@/hooks/modal';

const useAddObtainedCoursesModalAtom = atom<boolean>(false);

export const useAddObtainedCoursesModal = () =>
  useSimpleModal(useAddObtainedCoursesModalAtom);
