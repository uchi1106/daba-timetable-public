import { atom, useAtom, useAtomValue } from 'jotai';
import { SetStateAction, useCallback, useEffect } from 'react';

import { Course, CourseIdYearPair } from '@/types/course';

import { useAPI } from './client';
import { useFacultyRequirements } from './facultyRequirement';
import { useLocalStorageManagement } from './localStorageManagement';
import { useSnackbar } from './snackbar';

const coursesAtom = atom<Course[]>([]);

const TagsAtom = atom<string[]>([]);

interface UseCoursesResult {
  courses: Course[];

  setCourses: (courses: SetStateAction<Course[]>) => void;

  updateCourse: (course: Course) => void;

  fetchCourses: (faculties: string[]) => void;

  validateCourses: (
    courseIdYearPairs: CourseIdYearPair[]
  ) => Promise<{ obtainedCourseIds: string[]; localPastCourses: Course[] }>;
}

export const useCourses = (): UseCoursesResult => {
  const [courses, setCourses] = useAtom(coursesAtom);
  const api = useAPI();
  const { pushSnackbarMessage } = useSnackbar();

  const { setFacultyRequirements } = useFacultyRequirements();

  const {
    localObtainedCourseIds,
    updateLocalObtainedCourseIds,
    localFacultyRequirements,
    updateLocalFacultyRequirements,
    localTags,
    localCourseEnrolledYears,
    updateLocalCourseEnrolledYears,
    localPastCourseIds,
    localClassrooms,
    updateLocalClassrooms,
  } = useLocalStorageManagement();

  const requiredCourseNames: string[] = localFacultyRequirements.reduce(
    (accumRequiredCourseNames, facultyRequirement) => {
      accumRequiredCourseNames = [
        ...accumRequiredCourseNames,
        ...facultyRequirement.requiredCourseNames,
      ];
      return accumRequiredCourseNames;
    },
    [] as string[]
  );

  const applyLocalCoursesChange = (fetchedCourses: Course[]): Course[] => {
    const findLocalEnrolledYear = (courseId: string) => {
      const localCourseEnrolledYear = localCourseEnrolledYears.find(
        (localCourseEnrolledYear) =>
          localCourseEnrolledYear.course_id === courseId
      );
      return localCourseEnrolledYear
        ? localCourseEnrolledYear.enrolled_year
        : null;
    };

    const updatedCourses: Course[] = fetchedCourses.map((course) => ({
      ...course,
      obtained: localObtainedCourseIds.includes(course.course_id),
      required: requiredCourseNames.includes(course.course_name),
      enrolled_year: findLocalEnrolledYear(course.course_id),
      classroom:
        localClassrooms.find(
          (localClassroom) => localClassroom.course_id === course.course_id
        )?.classroom || null,
      tags: [
        ...course.tags,
        ...localTags
          .filter((tag) => tag.courseNames.includes(course.course_name))
          .map((tag) => tag.tagName),
      ],
    }));

    return updatedCourses;
  };

  const fetchCourses = useCallback(
    async (faculties: string[]) => {
      try {
        const fetchedCourses = await api.fetchCourses(
          faculties,
          localPastCourseIds
        );
        const updatedCourses = applyLocalCoursesChange(fetchedCourses);
        setCourses(updatedCourses);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        // エラー処理を追加（例：エラー状態の設定、ユーザーへの通知など）
      }
      // TODO: 依存配列を変更せずにワーニングが出ないようにする
    },
    [api]
  );

  const validateCourses = useCallback(
    async (courseIdYearPairs: CourseIdYearPair[]) => {
      try {
        const { obtainedCourseIds, localPastCourses } =
          await api.validateCourses(courseIdYearPairs);

        return { obtainedCourseIds, localPastCourses };
      } catch (error) {
        console.error('Failed to validate courses:', error);
        throw error;
      }
    },
    [api]
  );

  const updateCourse = (targetCourse: Course) => {
    // 取得されたコースのidをローカルストレージに保存
    if (targetCourse.obtained === true) {
      updateLocalObtainedCourseIds((prevCourseIds) => {
        if (!prevCourseIds.includes(targetCourse.course_id)) {
          return [...prevCourseIds, targetCourse.course_id];
        }
        return prevCourseIds;
      });
    } else {
      updateLocalObtainedCourseIds((prevCourseIds) =>
        prevCourseIds.filter((courseId) => courseId !== targetCourse.course_id)
      );
    }

    // 必修に設定されたコースのidをローカルストレージに保存
    if (targetCourse.required === true) {
      setFacultyRequirements((prevFacultyRequirements) => {
        const newFacultyRequirements = prevFacultyRequirements.map(
          (facultyRequirement) => {
            if (facultyRequirement.facultyName === targetCourse.faculty) {
              // 新しい名前をリストを加えて重複を削除
              const newRequiredCourseNames: string[] = Array.from(
                new Set([
                  ...facultyRequirement.requiredCourseNames,
                  targetCourse.course_name,
                ])
              );
              return {
                ...facultyRequirement,
                requiredCourseNames: newRequiredCourseNames,
              };
            } else {
              return facultyRequirement;
            }
          }
        );
        updateLocalFacultyRequirements(newFacultyRequirements);
        return newFacultyRequirements;
      });
    } else {
      setFacultyRequirements((prevFacultyRequirements) => {
        const newFacultyRequirements = prevFacultyRequirements.map(
          (facultyRequirement) => {
            if (facultyRequirement.facultyName === targetCourse.faculty) {
              return {
                ...facultyRequirement,
                requiredCourseNames:
                  facultyRequirement.requiredCourseNames.filter(
                    (courseName) => courseName !== targetCourse.course_name
                  ),
              };
            } else {
              return facultyRequirement;
            }
          }
        );
        updateLocalFacultyRequirements(newFacultyRequirements);
        return newFacultyRequirements;
      });
    }

    // 登録されたコースのidと年をローカルストレージに保存
    if (targetCourse.enrolled_year) {
      const targetCourseEnrolledYear = {
        course_id: targetCourse.course_id,
        enrolled_year: targetCourse.enrolled_year,
      };

      const newEnrolledYears = [
        ...localCourseEnrolledYears.filter(
          (enrolledYear) =>
            enrolledYear.course_id !== targetCourseEnrolledYear.course_id
        ),
        targetCourseEnrolledYear,
      ];
      updateLocalCourseEnrolledYears(newEnrolledYears);
    } else {
      updateLocalCourseEnrolledYears((preLocalCourseEnrolledYears) =>
        preLocalCourseEnrolledYears.filter(
          (localCourseEnrolledYear) =>
            localCourseEnrolledYear.course_id !== targetCourse.course_id
        )
      );
    }
    // 登録されたコースの教室をローカルストレージに保存
    if (targetCourse.classroom) {
      const targetCourseClassroom = {
        course_id: targetCourse.course_id,
        classroom: targetCourse.classroom,
      };

      const newClassrooms = [
        ...localClassrooms.filter(
          (localClassroom) =>
            localClassroom.course_id !== targetCourseClassroom.course_id
        ),
        targetCourseClassroom,
      ];
      updateLocalClassrooms(newClassrooms);
    } else {
      // 教室がnullの場合はローカルストレージから削除
      updateLocalClassrooms((preLocalClassrooms) =>
        preLocalClassrooms.filter(
          (localClassroom) =>
            localClassroom.course_id !== targetCourse.course_id
        )
      );
    }

    const takeDiff = (prev: Course, next: Course) => {
      if (prev.obtained !== next.obtained) {
        pushSnackbarMessage(
          'success',
          next.obtained
            ? `${prev.course_name}-を取得済に登録しました`
            : `${prev.course_name}-を取得済から外しました`
        );
      }

      if (prev.required !== next.required) {
        pushSnackbarMessage(
          'success',
          next.required
            ? `${prev.course_name}-を必修の授業に登録しました`
            : `${prev.course_name}-を必修の授業から外しました`
        );
      }

      if (prev.enrolled_year !== next.enrolled_year) {
        pushSnackbarMessage(
          'success',
          next.enrolled_year !== null
            ? `${next.course_name}-を${next.enrolled_year}年の時間割に登録しました`
            : `${next.course_name}-を時間割から外しました`
        );
      }
    };

    let prevCourse: Course | null = null;

    // 全体のコースの特定のコースを更新
    setCourses((prevcourses) => {
      return prevcourses.map((course) => {
        if (course.course_id === targetCourse.course_id) {
          prevCourse = course;
          return targetCourse;
        } else {
          return course;
        }
      });
    });

    if (prevCourse) {
      takeDiff(prevCourse, targetCourse);
    }
  };

  return {
    courses,
    setCourses,
    updateCourse,
    fetchCourses,
    validateCourses,
  };
};

interface UseTagsResult {
  tags: string[];
}

export const useTags = (): UseTagsResult => {
  const [tags, setTags] = useAtom(TagsAtom);
  const courses = useAtomValue(coursesAtom);

  useEffect(() => {
    const tagsSet: Set<string> = new Set();

    courses.forEach((course) => {
      course.tags.forEach((tag) => {
        tagsSet.add(tag);
      });
    });

    setTags(Array.from(tagsSet));
  }, [courses, setTags]);

  return { tags };
};
