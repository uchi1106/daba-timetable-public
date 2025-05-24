import { atom } from 'jotai';

import { useSimpleModal } from '@/hooks/modal';

const useInitModalAtom = atom<boolean>(false);

export const useInitModal = () => useSimpleModal(useInitModalAtom);
