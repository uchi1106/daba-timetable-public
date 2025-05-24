import { customAlphabet } from 'nanoid';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabaseClient';

export async function POST(request: Request) {
  try {
    // 一意なコードを生成
    const nanoid = customAlphabet(
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      4
    );
    const code = nanoid(4);

    const { longCode, isOneUse } = (await request.json()) as {
      longCode: string;
      isOneUse: boolean;
    };

    if (!longCode || isOneUse === undefined) {
      return NextResponse.json(
        { error: '設定コードが指定されていません' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('setting_code').insert([
      {
        code: code,
        long_code: longCode,
        is_one_use: isOneUse,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(code);
  } catch (err) {
    return NextResponse.json(
      {
        error: `データの追加に失敗しました: ${err instanceof Error ? err.message : err}`,
      },
      { status: 500 }
    );
  }
}
