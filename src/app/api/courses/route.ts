import { NextRequest, NextResponse } from 'next/server';

import { EARLIEST_YEAR, LATEST_YEAR } from '@/constants/year';
import { Course } from '@/types/course';
import { supabase } from '@/utils/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    // URLパラメータから学部名を取得
    const searchParams = request.nextUrl.searchParams;
    const facultyNamesParam = searchParams.get('faculties');

    // 過去の授業コードを取得(「授業コード_年度」という形式)
    const pastCourseIdsParam = searchParams.get('pastCourseIds');

    if (!facultyNamesParam) {
      return NextResponse.json(
        { error: '学部名が指定されていません' },
        { status: 400 }
      );
    }

    // 学部名をカンマで区切って配列に変換
    const faculties: string[] = facultyNamesParam.split(',');

    // 過去の授業コードをカンマで区切って配列に変換
    const pastCourseIds: string[] = pastCourseIdsParam
      ? pastCourseIdsParam.split(',')
      : [];

    const pastCourseIdsMap = new Map<string, string[]>();

    pastCourseIds.forEach((courseIdWithYear) => {
      const [courseId, year] = courseIdWithYear.split('_');

      if (!pastCourseIdsMap.has(year)) {
        pastCourseIdsMap.set(year, []);
      }

      // 対象の年度の授業コードのリストを取得
      const pastCourseIdsList = pastCourseIdsMap.get(year);
      if (pastCourseIdsList) {
        const newPastCourseIdsList: string[] = [...pastCourseIdsList, courseId];
        // 新しい授業コードのリストをセット
        pastCourseIdsMap.set(year, newPastCourseIdsList);
      }
    });

    const pastCourses: Course[] = [];

    // データベースに存在する授業の年度のリスト
    const years = Array.from(
      { length: LATEST_YEAR - EARLIEST_YEAR + 1 },
      (_, i) => EARLIEST_YEAR + i
    );

    for (const [year, courseIds] of pastCourseIdsMap) {
      if (!years.includes(Number(year))) {
        continue; // 年度が整数でない場合はスキップ
      }

      const { data, error } = await supabase
        .from(`courses_${year}`) // テーブル名を指定
        .select(
          'course_id, faculty, course_name, instructor, dates, required_grade, credits, tags, url, course_outline, evaluation_criteria'
        )
        .in('course_id', courseIds)
        .order('course_id', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }
      const targetPastCourses: Course[] = (data as Course[]).map((course) => {
        return {
          ...course,
          course_id: `${course.course_id}_${year}`, // 授業コードと年度を結合
          tags: [...course.tags, `${year}年度`], // タグにどの年度から取得した授業かを追加
        };
      });

      pastCourses.push(...targetPastCourses);
    }

    const { data, error } = await supabase
      .from(`courses_${LATEST_YEAR}`) // テーブル名を指定
      .select(
        'course_id, faculty, course_name, instructor, dates, required_grade, credits, tags, url, course_outline, evaluation_criteria'
      )
      .in('faculty', faculties)
      .order('course_id', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    const allCourses: Course[] = [...(data as Course[]), ...pastCourses];

    return NextResponse.json(allCourses);
  } catch (err) {
    return NextResponse.json(
      {
        error: `An error occurred while fetching the course data. ${err}`,
      },
      { status: 500 }
    );
  }
}
