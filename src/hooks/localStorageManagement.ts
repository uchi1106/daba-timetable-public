import { CourseIdAndClassroom, CourseIdAndEnrolledYear } from '@/types/course';
import { FacultyRequirement } from '@/types/facultyRequirement';
import { TagToCourseNames } from '@/types/tagToCourseNames';

import { useLocalStorage } from './localStorage';

export const useLocalStorageManagement = () => {
  const {
    value: localFacultyRequirements,
    updateValue: updateLocalFacultyRequirements,
    removeValue: removeLocalFacultyRequirements,
  } = useLocalStorage<FacultyRequirement[]>('facultyRequirements', []);

  const {
    value: localTags,
    updateValue: updateLocalTags,
    removeValue: removeLocalTags,
  } = useLocalStorage<TagToCourseNames[]>('tags', []);

  const {
    value: localObtainedCourseIds,
    updateValue: updateLocalObtainedCourseIds,
    removeValue: removeLocalObtainedCourseIds,
  } = useLocalStorage<string[]>('obtainedCourseIds', []);

  const {
    value: localCourseEnrolledYears,
    updateValue: updateLocalCourseEnrolledYears,
    removeValue: removeLocalCourseEnrolledYears,
  } = useLocalStorage<CourseIdAndEnrolledYear[]>('courseEnrolledYears', []);

  const {
    value: localPastCourseIds,
    updateValue: updateLocalPastCourseIds,
    removeValue: removeLocalPastCourseIds,
  } = useLocalStorage<string[]>('pastCourseIds', []);

  const {
    value: localClassrooms,
    updateValue: updateLocalClassrooms,
    removeValue: removeLocalClassrooms,
  } = useLocalStorage<CourseIdAndClassroom[]>('classrooms', []);

  const updateLocalStorages = (
    facultyRequirements?: FacultyRequirement[],
    tags?: TagToCourseNames[],
    obtainedCourseIds?: string[],
    courseEnrolledYears?: CourseIdAndEnrolledYear[],
    pastCourseIds?: string[],
    classrooms?: CourseIdAndClassroom[]
  ) => {
    if (facultyRequirements) {
      updateLocalFacultyRequirements(facultyRequirements);
    }

    if (tags) {
      updateLocalTags(tags);
    }

    if (obtainedCourseIds) {
      updateLocalObtainedCourseIds(obtainedCourseIds);
    }

    if (courseEnrolledYears) {
      updateLocalCourseEnrolledYears(courseEnrolledYears);
    }
    if (pastCourseIds) {
      updateLocalPastCourseIds(pastCourseIds);
    }
    if (classrooms) {
      updateLocalClassrooms(classrooms);
    }
  };

  interface ResetOptions {
    facultyRequirements?: boolean;
    tags?: boolean;
    obtainedCourseIds?: boolean;
    courseEnrolledYears?: boolean;
    pastCourseIds?: boolean;
    classrooms?: boolean;
  }

  const resetLocalStorages = (options: ResetOptions) => {
    if (options.facultyRequirements) {
      removeLocalFacultyRequirements();
    }

    if (options.tags) {
      removeLocalTags();
    }

    if (options.obtainedCourseIds) {
      removeLocalObtainedCourseIds();
    }

    if (options.courseEnrolledYears) {
      removeLocalCourseEnrolledYears();
    }
    if (options.pastCourseIds) {
      removeLocalPastCourseIds();
    }
    if (options.classrooms) {
      removeLocalClassrooms();
    }
  };

  return {
    localFacultyRequirements,
    updateLocalFacultyRequirements,
    localTags,
    updateLocalTags,
    localObtainedCourseIds,
    updateLocalObtainedCourseIds,
    localCourseEnrolledYears,
    updateLocalCourseEnrolledYears,
    localPastCourseIds,
    updateLocalPastCourseIds,
    localClassrooms,
    updateLocalClassrooms,
    updateLocalStorages,
    resetLocalStorages,
  };
};
