import { atom } from 'jotai';

import { LATEST_YEAR } from '@/constants/year';
// 表示する年度
export const targetEnrolledYearAtom = atom<number>(LATEST_YEAR);
