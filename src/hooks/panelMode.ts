import { atom } from 'jotai';

type PanelMode = 'timeTable' | 'courseManagement' | 'allCourses';

export const panelModeAtom = atom<PanelMode>('timeTable');
