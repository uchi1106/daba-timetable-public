import { atom } from 'jotai';

import { DetailModal, useDetailModal } from '@/hooks/modal';
import { Course } from '@/types/course';

const useCourseDetailModalAtom = atom<Course | null>(null as Course | null);

export const useCourseDetailModal = (): DetailModal<Course | null> =>
  useDetailModal(useCourseDetailModalAtom);
