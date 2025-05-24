import { PostgrestError } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import {
  OVERLAP_NAME_AND_TEACHER_COURSES,
  OVERLAP_NAME_COURSES,
} from '@/constants/course';
import { LATEST_YEAR } from '@/constants/year';
import { Course, CourseIdYearPair } from '@/types/course';
import { ValidateCoursesResult } from '@/utils/APIClient';
import { supabase } from '@/utils/supabaseClient';

async function findOldCourseByCourseId(
  targetTableName: string,
  courseId: string
): Promise<Course[]> {
  try {
    const { data: oldData, error: oldError } = (await supabase
      .from(targetTableName)
      .select('*')
      .eq('course_id', courseId)) as {
      // 単一のCourseが返ってくるので、Course型を指定
      data: Course[];
      error: PostgrestError | null;
    };

    if (oldError) {
      throw new Error(oldError.message);
    }
    return oldData;
  } catch (error) {
    console.error(`Error fetching old course:`, error, courseId, LATEST_YEAR);
    throw error;
  }
}

async function findLatestCourseByCourseName(
  courseName: string
): Promise<Course[]> {
  try {
    const { data, error } = (await supabase
      .from(`courses_${LATEST_YEAR}`)
      .select('*')
      .eq('course_name', courseName)) as {
      data: Course[];
      error: PostgrestError | null;
    };
    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error(
      `Error fetching latest course:`,
      error,
      courseName,
      LATEST_YEAR
    );
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const { courseIdYearPairs } = (await req.json()) as {
      courseIdYearPairs: CourseIdYearPair[];
    };
    // 取得したcourse_idを格納する配列
    const obtainedCourseIds: string[] = [];
    // ローカルに登録する授業情報を格納する配列
    const localPastCourses: Course[] = [];

    // 過去の授業の情報をローカルに登録し、そのcourse_idをローカルに登録する関数
    const EnrollOldCourse = (course: Course, year: number) => {
      const oldCourseId = course.course_id + '_' + year.toString();
      obtainedCourseIds.push(oldCourseId);
      localPastCourses.push({
        ...course,
        course_id: oldCourseId,
        tags: [...course.tags, `${year}年度`],
      });
    };

    // courseIdYearPairsの１つ１つの要素に対して処理
    for (const courseIdYearPair of courseIdYearPairs) {
      // 最新の年度の場合、そのままcourse_idを追加
      if (courseIdYearPair.year === LATEST_YEAR) {
        obtainedCourseIds.push(courseIdYearPair.course_id);
        continue;
      }

      // 過去の年度のテーブル名
      const targetTableName: string =
        'courses_' + courseIdYearPair.year.toString();

      try {
        // 旧データを取得
        const oldData = await findOldCourseByCourseId(
          targetTableName,
          courseIdYearPair.course_id
        );
        if (oldData.length === 0) {
          console.log(
            `No data found for course_id: ${courseIdYearPair.course_id} in year: ${courseIdYearPair.year} in table: ${targetTableName}`
          );
          continue; // 次のループに進む
        }

        const oldCourse: Course = oldData[0];

        // 授業名と先生が同時に重複するか
        const isCourseNamesAndTeacherOverlap =
          OVERLAP_NAME_AND_TEACHER_COURSES.includes(oldCourse.course_name);

        // 授業名が重複するか
        const isCourseNameOverlap = OVERLAP_NAME_COURSES.includes(
          oldCourse.course_name
        );

        // 授業名と先生が同時に重複する場合、過去の授業情報を追加
        if (isCourseNamesAndTeacherOverlap) {
          EnrollOldCourse(oldCourse, courseIdYearPair.year);
        } else {
          // 授業名と先生が同時に重複しない場合
          // 最新の授業の中から過去の授業と「授業名」が一致するものを取得
          const latestData = await findLatestCourseByCourseName(
            oldCourse.course_name
          );

          if (latestData.length === 0) {
            // 最新のデータが存在しない場合、過去の授業情報を追加
            EnrollOldCourse(oldCourse, courseIdYearPair.year);
          } else {
            // 授業名が重複する場合、先生が過去のデータの先生と一致するかで目的の授業を特定
            if (isCourseNameOverlap) {
              const latestCourse = latestData.find(
                (course) => course.instructor === oldCourse.instructor
              );

              if (latestCourse) {
                obtainedCourseIds.push(latestCourse.course_id);
              } else {
                // 先生が一致する授業が存在しない場合、過去の授業情報を追加
                EnrollOldCourse(oldCourse, courseIdYearPair.year);
              }
            }
            // 授業名が重複しない場合、１つしか授業を取得してないのでそのまま追加
            else {
              const latestCourse = latestData[0];
              obtainedCourseIds.push(latestCourse.course_id);
            }
          }
        }
      } catch (error) {
        console.error(
          `Error processing course_id: ${courseIdYearPair.course_id} in year: ${courseIdYearPair.year}`,
          error
        );
        // エラーハンドリングの追加処理をここに書く
      }
    }
    const validateCoursesResult: ValidateCoursesResult = {
      obtainedCourseIds,
      localPastCourses,
    };
    return NextResponse.json(validateCoursesResult);
  } catch (err) {
    return NextResponse.json(
      {
        error: `An error occurred while fetching the course data. ${err}`,
      },
      { status: 500 }
    );
  }
}
