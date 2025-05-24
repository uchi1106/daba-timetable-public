import { DAY_OF_WEEKS } from '@/constants/days';
import { Course } from '@/types/course';

export type CourseOrNull = Course | null;

export const controlTimeTable = (
  courses: Course[],
  targetEnrolledYear: number,
  targetTerm: string
) => {
  // 時間が重複、または時間のデータが不足している授業を格納する配列
  const overCourses: Course[] = [];

  // tergetEnrolledYearと一致するenrolled_yearの授業を抽出
  const enrolledYearCourses = courses
    .filter((course) => course.enrolled_year === targetEnrolledYear)
    .filter((course) => {
      // datesが空の場合、overCoursesに追加
      if (course.dates.length === 0) {
        overCourses.push(course);
        return false;
      } else return true;
    });

  const targetTermCourses = enrolledYearCourses
    // targetTermと一致する時間割データをもつ授業を抽出
    .filter((course) =>
      course.dates.some((date) => {
        return date.term === targetTerm;
      })
    );

  const coursesTable: CourseOrNull[][] = Array.from({ length: 6 }, () =>
    Array(6).fill(null)
  );

  targetTermCourses.forEach((course) => {
    // 授業が1つの開講期、かつ１つの曜日にしかない場合
    if (course.dates.length === 1) {
      const dayIndex: number = DAY_OF_WEEKS.indexOf(course.dates[0].day);
      const periodIndexes: number[] = course.dates[0].period
        ? course.dates[0].period
        : [];
      periodIndexes.forEach((periodIndex) => {
        if (periodIndex >= 1 && periodIndex <= 6) {
          if (coursesTable[periodIndex - 1][dayIndex] === null) {
            coursesTable[periodIndex - 1][dayIndex] = course;
          } else {
            overCourses.push(course);
          }
        }
      });
    } else {
      // 授業が複数の開講期、または複数の曜日にある場合
      const targetDates = course.dates.filter(
        (date) => date.term === targetTerm
      );

      targetDates.forEach((targetDate) => {
        const dayIndex: number = DAY_OF_WEEKS.indexOf(targetDate.day);
        const periodIndexes: number[] = targetDate.period
          ? targetDate.period
          : [];
        periodIndexes.forEach((periodIndex) => {
          if (coursesTable[periodIndex - 1][dayIndex] === null) {
            coursesTable[periodIndex - 1][dayIndex] = course;
          } else {
            overCourses.push(course);
          }
        });
      });
    }
  });

  return { targetTermCourses, coursesTable, overCourses };
};
