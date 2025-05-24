import { NextResponse } from 'next/server';

import { CourseIdAndClassroom } from '@/types/course';
import { supabase } from '@/utils/supabaseClient';

export async function POST(request: Request) {
  try {
    const { courseIdAndClassroom } = (await request.json()) as {
      courseIdAndClassroom: CourseIdAndClassroom;
    };

    // TODO: 全てをrpcで実行し、トランザクションを使用するべきかも

    // CourseIdAndClassroomと一致する行があるかを確認
    const { data, error } = (await supabase
      .from(`classroom`) // テーブル名を指定
      .select('course_id, classroom, count')
      .eq('course_id', courseIdAndClassroom.course_id)
      .eq('classroom', courseIdAndClassroom.classroom)) as {
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

    // 一致する行がない場合は新規に追加
    if (data.length === 0) {
      const { error } = await supabase.from('classroom').insert([
        {
          course_id: courseIdAndClassroom.course_id,
          classroom: courseIdAndClassroom.classroom,
          count: 1,
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }
    } else {
      // 一致する行がある場合はカウントを更新
      const { error } = await supabase.rpc('increment_classroom_count', {
        target_course_id: courseIdAndClassroom.course_id,
        target_classroom: courseIdAndClassroom.classroom,
      });

      if (error) {
        throw new Error(error.message);
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (err) {
    return NextResponse.json(
      {
        error: `An error occurred while enroll the courseIdAndClassroom. ${err}`,
      },
      { status: 500 }
    );
  }
}
