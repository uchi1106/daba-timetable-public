import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';

import { CourseIdAndClassroom } from '@/types/course';

import { useAPI } from './client';
import { useCourses } from './course';
import { useLocalStorageManagement } from './localStorageManagement';

const classroomsAtom = atom<string[]>([]);
interface UseClassroomResult {
  classrooms: string[];
  setClassrooms: (classrooms: string[]) => void;
  getClassroom: (courseId: string) => void;
  enrollClassroom: (courseIdAndClassroom: CourseIdAndClassroom) => void;
  bulkEnrollClassroom: (courseIds: string[]) => void;
}

export const useClassroom = (): UseClassroomResult => {
  const { setCourses } = useCourses();
  const api = useAPI();
  const { updateLocalClassrooms } = useLocalStorageManagement();
  const [classrooms, setClassrooms] = useAtom(classroomsAtom);

  const bulkEnrollClassroom = useCallback(
    async (courseIds: string[]) => {
      try {
        const enrolledClassrooms = await api.bulkEnrollClassroom(courseIds);
        setCourses((prevCourses) => {
          const newCourses = prevCourses.map((course) => {
            const enrolledClassroom = enrolledClassrooms.find(
              (enrolledClassroom) =>
                enrolledClassroom.course_id === course.course_id
            );
            if (enrolledClassroom) {
              return {
                ...course,
                classroom: enrolledClassroom.classroom,
              };
            }
            return course;
          });
          return newCourses;
        });

        // ローカルの教室情報を更新
        updateLocalClassrooms((prevClassrooms) => {
          // courseIdsに含まれない教室を抽出
          const filteredClassrooms = prevClassrooms.filter(
            (classroom) => !courseIds.includes(classroom.course_id)
          );

          // 新しく登録された教室を追加
          const newClassrooms = [...filteredClassrooms, ...enrolledClassrooms];
          return newClassrooms;
        });
      } catch (error) {
        console.error('Failed to bulk enroll classrooms:', error);
      }
    },
    [api]
  );

  const getClassroom = useCallback(
    async (courseId: string) => {
      try {
        const classrooms = await api.getClassroom(courseId);
        setClassrooms(classrooms);
      } catch (error) {
        console.error('Failed to get classroom:', error);
      }
    },
    [api]
  );

  const enrollClassroom = useCallback(
    async (courseIdAndClassroom: CourseIdAndClassroom) => {
      try {
        await api.enrollClassroom(courseIdAndClassroom);
      } catch (error) {
        console.error('Failed to enroll classroom:', error);
      }
    },
    [api]
  );

  return {
    classrooms,
    setClassrooms,
    getClassroom,
    enrollClassroom,
    bulkEnrollClassroom,
  };
};
