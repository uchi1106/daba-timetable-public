import { atom } from 'jotai';

import { useSimpleModal } from '@/hooks/modal';

const useLocalStorageSettingModalAtom = atom<boolean>(false);

export const useLocalStorageSettingModal = () =>
  useSimpleModal(useLocalStorageSettingModalAtom);
