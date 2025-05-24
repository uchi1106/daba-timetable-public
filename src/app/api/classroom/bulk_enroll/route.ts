import { NextResponse } from 'next/server';

import { CourseIdAndClassroom } from '@/types/course';
import { supabase } from '@/utils/supabaseClient';

export async function POST(request: Request) {
  try {
    const { courseIds } = (await request.json()) as {
      courseIds: string[];
    };

    const courseIdAndClassrooms: CourseIdAndClassroom[] = courseIds.map(
      (courseId) => ({ course_id: courseId, classroom: '' }) // classroomは空文字列で初期化
    );

    // courseIdsに含まれる行があるかを確認
    const { data, error } = (await supabase
      .from(`classroom`) // テーブル名を指定
      .select('course_id, classroom, count')
      .in('course_id', courseIds)) as {
      data: {
        course_id: string;
        classroom: string;
        count: number;
      }[];
      error: { message: string } | null;
    };

    if (error) {
      throw new Error(error.message);
    }

    courseIdAndClassrooms.map((courseIdAndClassroom) => {
      const targetClassrooms = data
        .filter((item) => item.course_id === courseIdAndClassroom.course_id)
        .sort((a, b) => b.count - a.count);

      //  最も登録数が多い教室を取得。classroomが登録されていない授業は食う文字列のまま
      if (targetClassrooms.length > 0) {
        courseIdAndClassroom.classroom = targetClassrooms[0].classroom;
      }
    });

    for (let i = 0; i < courseIdAndClassrooms.length; i++) {
      const courseIdAndClassroom = courseIdAndClassrooms[i];
      const { error } = await supabase.rpc('increment_classroom_count', {
        target_course_id: courseIdAndClassroom.course_id,
        target_classroom: courseIdAndClassroom.classroom,
      });

      if (error) {
        throw new Error(error.message);
      }
    }

    return NextResponse.json(courseIdAndClassrooms);
  } catch (err) {
    return NextResponse.json(
      {
        error: `An error occurred while enroll the courseIdAndClassroom. ${err}`,
      },
      { status: 500 }
    );
  }
}
