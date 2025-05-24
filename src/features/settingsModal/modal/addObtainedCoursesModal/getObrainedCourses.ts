import { LATEST_YEAR } from '@/constants/year';
import { CourseIdYearPair } from '@/types/course';

export const getObtaindCourseIds = (
  obtainedString: string
): CourseIdYearPair[] => {
  const courseIdPattern = /[A-Z]{2}\d{4}/g;
  const yearPattern = /20\d{2}/g;

  const obtainedCourseIds: CourseIdYearPair[] = [];

  const obtainedStringRows: string[] = obtainedString.split('\n');

  // 1行ずつ授業IDを取得
  obtainedStringRows.map((row) => {
    const courseIdMatch = Array.from(row.matchAll(courseIdPattern), (m) => ({
      match: m[0],
      index: m.index,
    }));

    // 授業IDが取得できた場合
    if (courseIdMatch.length !== 0) {
      const YearMatch = Array.from(
        row.slice(0, courseIdMatch[0].index).matchAll(yearPattern),
        (m) => ({
          match: m[0],
          index: m.index,
        })
      );

      // 年度が取得できた場合
      if (YearMatch.length !== 0) {
        obtainedCourseIds.push({
          course_id: courseIdMatch[0].match,
          year: parseInt(YearMatch[0].match),
        });
        // 年度が取得できなかった場合
      } else {
        obtainedCourseIds.push({
          course_id: courseIdMatch[0].match,
          year: LATEST_YEAR,
        });
      }
    }
    return obtainedCourseIds;
  });
  return obtainedCourseIds;
};
