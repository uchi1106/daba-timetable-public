import { atom } from 'jotai';

import { useSimpleModal } from '@/hooks/modal';

const useShareModalAtom = atom<boolean>(false);

export const useShareModal = () => useSimpleModal(useShareModalAtom);
