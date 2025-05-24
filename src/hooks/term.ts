import { atom } from 'jotai';

import { CURRENT_TERM } from '@/constants/term';
type Term = '前期' | '後期';

// TimeTable(時間割)で表示する学期
export const targetEnrolledTermAtom = atom<Term>(CURRENT_TERM);
