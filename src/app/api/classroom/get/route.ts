import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/utils/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    // URLパラメータから授業コードと教室名を取得
    const searchParams = request.nextUrl.searchParams;
    const courseIdParam = searchParams.get('courseId');

    if (!courseIdParam) {
      return NextResponse.json(
        { error: '授業コードと教室名が指定されていません' },
        { status: 400 }
      );
    }

    // JSON形式の文字列をオブジェクトに変換
    const courseId: string = courseIdParam;

    const { data, error } = (await supabase
      .from(`classroom`) // テーブル名を指定
      .select('course_id, classroom, count')
      .eq('course_id', courseId)) as {
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

    data.sort((a, b) => b.count - a.count); // countの降順でソート

    // 教室名の配列を作成
    const classrooms: string[] = data.map((item) => item.classroom);

    return NextResponse.json(classrooms);
  } catch (err) {
    return NextResponse.json(
      {
        error: `An error occurred while get the classRooms data. ${err}`,
      },
      { status: 500 }
    );
  }
}
