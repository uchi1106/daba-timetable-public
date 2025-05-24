import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabaseClient';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    // URLパラメータから短い設定コードのidを取得
    const { code } = await params;

    if (!code) {
      return NextResponse.json(
        { error: '設定コードが指定されていません' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from(`setting_code`) // テーブル名を指定
      .select('code, long_code, is_one_use, created_at, last_used')
      .eq('code', code);

    if (error) {
      throw new Error(error.message);
    }

    if (data.length === 0) {
      return NextResponse.json('');
    }

    if (data[0].is_one_use && data[0].last_used !== null) {
      return NextResponse.json('');
    }

    const { error: updateError } = await supabase
      .from('setting_code')
      .update({ last_used: new Date().toISOString() }) // 現在時刻を更新
      .eq('code', code);

    if (updateError) {
      throw new Error(updateError.message);
    }

    const longCode: string = data[0].long_code;
    return NextResponse.json(longCode);
  } catch (err) {
    return NextResponse.json(
      {
        error: `An error occurred while fetching the course data. ${err}`,
      },
      { status: 500 }
    );
  }
}
