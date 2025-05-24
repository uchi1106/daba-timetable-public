import { atom } from 'jotai';

import { useSimpleModal } from '@/hooks/modal';

const useUsageNotesModalAtom = atom<boolean>(false);

export const useUsageNotesModal = () => useSimpleModal(useUsageNotesModalAtom);
