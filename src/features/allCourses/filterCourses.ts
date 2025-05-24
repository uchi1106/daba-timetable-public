import { Course } from '@/types/course';

export const selectQualifiedCourses = (
  courses: Course[],
  targetName: string = '',
  targetFaculty: string = '',
  targetInstructor: string = '',
  targetTerm: string = '',
  targetTags: string[] = [],
  targetRequiredGrades: number[] = [1, 2, 3, 4],
  isRequired: boolean = false,
  isNotRequired: boolean = false,
  isObtained: boolean = false,
  isNotObtained: boolean = false,
  targetDay: string[] = [],
  targetPeriod: number[] = []
) => {
  let qualifiedCourses = courses;

  if (targetName !== '') {
    qualifiedCourses = qualifiedCourses.filter((course) =>
      course.course_name.includes(targetName)
    );
  }

  if (targetFaculty !== '') {
    qualifiedCourses = qualifiedCourses.filter(
      (course) => course.faculty === targetFaculty
    );
  }

  if (targetInstructor !== '') {
    qualifiedCourses = qualifiedCourses.filter((course) =>
      course.instructor?.includes(targetInstructor)
    );
  }

  if (targetTerm === '前期' || targetTerm === '後期') {
    qualifiedCourses = qualifiedCourses.filter(
      (course) =>
        course.dates &&
        course.dates.some((date) => date.term === targetTerm) === true
    );
  }

  if (targetTags.length !== 0) {
    qualifiedCourses = qualifiedCourses.filter((course) =>
      course.tags.some((tag) => targetTags.includes(tag))
    );
  }

  if (targetRequiredGrades?.length < 4 && targetRequiredGrades?.length > 0) {
    qualifiedCourses = qualifiedCourses.filter(
      (course) =>
        course.required_grade &&
        targetRequiredGrades.includes(course.required_grade)
    );
  }

  if (isRequired === true) {
    qualifiedCourses = qualifiedCourses.filter(
      (course) => course.required === true
    );
  }

  if (isNotRequired === true) {
    qualifiedCourses = qualifiedCourses.filter(
      (course) => course.required === false
    );
  }

  if (isObtained === true) {
    qualifiedCourses = qualifiedCourses.filter(
      (course) => course.obtained === true
    );
  }

  if (isNotObtained === true) {
    qualifiedCourses = qualifiedCourses.filter(
      (course) => course.obtained === false
    );
  }

  if (targetDay.length > 0) {
    qualifiedCourses = qualifiedCourses.filter((course) =>
      course.dates?.some((date) => targetDay.includes(date.day))
    );
  }

  if (targetPeriod.length > 0) {
    const castedTargetPeriod = targetPeriod.map((period) => Number(period));
    qualifiedCourses = qualifiedCourses.filter((course) =>
      course.dates?.some((date) =>
        date.period?.some((period) => castedTargetPeriod.includes(period))
      )
    );
  }

  return qualifiedCourses;
};
