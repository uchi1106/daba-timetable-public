import { atom } from 'jotai';

import { DetailModal, useDetailModal } from '@/hooks/modal';
import { Course } from '@/types/course';

// TODO: electiveRequirementの削除 もここに統合するべきかもしれない
type ResetMode = 'setting';

// TODO: facultyRequirementsとrequired、remeinCoursesもオプションに追加するべきかもしれない
type Obtion = 'all' | 'obtained' | 'fucultyRequirements';

interface ResetConfirmData {
  mode: ResetMode;
  data: Obtion | Course;
}

const useResetConfirmAtom = atom<ResetConfirmData | null>(
  null as ResetConfirmData | null
);

export const useResetConfirmModal = (): DetailModal<ResetConfirmData | null> =>
  useDetailModal(useResetConfirmAtom);
