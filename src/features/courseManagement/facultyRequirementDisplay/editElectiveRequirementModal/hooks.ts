import { atom } from 'jotai';

import { DetailModal, useDetailModal } from '@/hooks/modal';
import { ElectiveRequirement } from '@/types/facultyRequirement';

const editElectiveRequirementModalAtom = atom<ElectiveRequirement | null>(
  null as ElectiveRequirement | null
);
export const useEditElectiveRequirementModal =
  (): DetailModal<ElectiveRequirement | null> =>
    useDetailModal(editElectiveRequirementModalAtom);
