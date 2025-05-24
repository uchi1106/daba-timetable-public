import { atom } from 'jotai';

import { useSimpleModal } from '@/hooks/modal';

const useSettingsModalAtom = atom<boolean>(false);

export const useSettingsModal = () => useSimpleModal(useSettingsModalAtom);
