import { atom } from 'jotai';

import { useSimpleModal } from '@/hooks/modal';

const useEditRequiredCourseModalAtom = atom<boolean>(false);

export const useEditRequiredCourseModal = () =>
  useSimpleModal(useEditRequiredCourseModalAtom);
