import { atom, SetStateAction, useAtom } from 'jotai';

import { FacultyRequirement } from '@/types/facultyRequirement';

import { useLocalStorage } from './localStorage';

const facultyRequirementAtom = atom<FacultyRequirement[]>([]);

interface useFacultyRequirementsResult {
  facultyRequirements: FacultyRequirement[];
  setFacultyRequirements: (
    facultyRequirements: SetStateAction<FacultyRequirement[]>
  ) => void;
  updateFacultyRequirement: (facultyRequirement: FacultyRequirement) => void;
  addFaculltyRequirement: (facultyRequirement: FacultyRequirement) => void;
}

export const useFacultyRequirements = (): useFacultyRequirementsResult => {
  const [facultyRequirements, setFacultyRequirements] = useAtom(
    facultyRequirementAtom
  );
  const { updateValue: updateLocalFacultyRequirements } = useLocalStorage<
    FacultyRequirement[]
  >('facultyRequirements', facultyRequirements);

  const updateFacultyRequirement = (facultyRequirement: FacultyRequirement) => {
    setFacultyRequirements((prevFacultyRequirements) => {
      const newFacultyRequirements = prevFacultyRequirements.map(
        (prevFacultyRequiment) => {
          if (
            prevFacultyRequiment.facultyName === facultyRequirement.facultyName
          ) {
            return { ...prevFacultyRequiment, ...facultyRequirement };
          } else {
            return prevFacultyRequiment;
          }
        }
      );
      updateLocalFacultyRequirements(newFacultyRequirements);
      return newFacultyRequirements;
    });
  };

  // TODO: 使われていないので削除すべきかも
  const addFaculltyRequirement = (facultyRequirement: FacultyRequirement) => {
    setFacultyRequirements((prevFacultyRequirements) => [
      ...prevFacultyRequirements,
      facultyRequirement,
    ]);
  };

  return {
    facultyRequirements,
    setFacultyRequirements,
    updateFacultyRequirement,
    addFaculltyRequirement,
  };
};
