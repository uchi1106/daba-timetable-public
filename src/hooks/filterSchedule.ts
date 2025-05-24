import { atom } from 'jotai';

import { CURRENT_TERM } from '@/constants/term';
import { Term } from '@/types/course';

export const filterTermAtom = atom<Term | ''>(CURRENT_TERM);
// コース一覧での絞り込み条件。詳細検索ボックスだけでなく、時間割からの絞り込みにも使われる
export const filterDayAtom = atom<string[]>([]);
export const filterPeriodAtom = atom<number[]>([]);
