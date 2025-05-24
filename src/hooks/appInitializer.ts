import { useEffect } from 'react';

import { useInitModal } from '@/features/common/initModal/hook';
import { FacultyRequirement } from '@/types/facultyRequirement';

import { useCourses } from './course';
import { useFacultyRequirements } from './facultyRequirement';
import { useLocalStorage } from './localStorage';

export const useAppInitializer = () => {
  const { fetchCourses } = useCourses();
  const { setFacultyRequirements } = useFacultyRequirements();
  const [, setIsModalOpen] = useInitModal();

  const { value: localFacultyRequirements } = useLocalStorage<
    FacultyRequirement[]
  >('facultyRequirements', []);

  useEffect(() => {
    if (localFacultyRequirements.length === 0) {
      setIsModalOpen(true);
    } else {
      fetchCourses(
        localFacultyRequirements.map(
          (facultyRequirement) => facultyRequirement.facultyName
        )
      );
      setFacultyRequirements(localFacultyRequirements);
    }
    // TODO: 依存配列を変更せずにワーニングが出ないようにする
  }, []);

  return;
};
