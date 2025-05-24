import { atom } from 'jotai';

import { useSimpleModal } from '@/hooks/modal';

const useAddElectiveRequirementModalAtom = atom<boolean>(false);

export const useAddElectiveRequirementModal = () =>
  useSimpleModal(useAddElectiveRequirementModalAtom);
