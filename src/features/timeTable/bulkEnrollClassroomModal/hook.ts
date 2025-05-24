import { atom } from 'jotai';

import { DetailModal, useDetailModal } from '@/hooks/modal';

const useBulkClassroomEnrollModalAtom = atom<string[] | null>(null);

export const useBulkClassroomEnrollModal = (): DetailModal<string[] | null> =>
  useDetailModal(useBulkClassroomEnrollModalAtom);
