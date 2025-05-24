import { atom } from 'jotai';

import { DetailModal, useDetailModal } from '@/hooks/modal';
import { ElectiveRequirement } from '@/types/facultyRequirement';

const deleteElectiveRequirementModalAtom = atom<ElectiveRequirement | null>(
  null as ElectiveRequirement | null
);
export const useDeleteElectiveRequirementModal =
  (): DetailModal<ElectiveRequirement | null> =>
    useDetailModal(deleteElectiveRequirementModalAtom);
