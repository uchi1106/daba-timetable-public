import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CalendarMonth, Checklist } from '@mui/icons-material';
import { Box, Button, Chip, Link, Typography } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { memo, useState } from 'react';

import AllCourses from '@/features/allCourses';
import CourseItem from '@/features/common/CourseItem';
import { useShareModal } from '@/features/common/shareModal/hook';
import { useUsageNotesModal } from '@/features/common/usageNotesModal/hook';
import { CourseManagement } from '@/features/courseManagement';
import { useSettingsModal } from '@/features/settingsModal/hook';
import Timetable from '@/features/timeTable';
import { useCourses } from '@/hooks/course';
import { filterTermAtom } from '@/hooks/filterSchedule';
import { useSnackbar } from '@/hooks/snackbar';
import { targetEnrolledTermAtom } from '@/hooks/term';
import { targetEnrolledYearAtom } from '@/hooks/year';
import { Course } from '@/types/course';

const LeftPanel = memo(() => (
  <Box
    sx={{
      height: '100%',
      width: '44dvw',
      borderRight: 1,
      borderColor: 'divider',
      position: 'fixed',
      ml: '1dvw',
    }}
  >
    <AllCourses />
  </Box>
));

const RightPanel = memo(() => {
  type Mode = 'timeTable' | 'courseManagement';
  const [mode, setMode] = useState<Mode>('timeTable');
  const [, setIsShareModalOpen] = useShareModal();
  const [, setIsSettingsModalOpen] = useSettingsModal();
  const [, setIsUsageNotesModalOpen] = useUsageNotesModal();

  const { pushSnackbarMessage } = useSnackbar();
  const targetEnrolledTerm = useAtomValue(targetEnrolledTermAtom);
  const [, setFilterTerm] = useAtom(filterTermAtom);

  return (
    <Box
      sx={{
        height: '100%',
        width: '52dvw',
        ml: '46dvw',
        mr: '1dvw',
        mt: '4px',
      }}
    >
      <Box
        sx={{
          width: '52dvw',
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button
          sx={{
            p: 0,
            position: 'fixed',
            zIndex: 2,
            opacity: 1,
          }}
          onClick={() => {
            if (mode === 'timeTable') {
              setMode('courseManagement');
              setFilterTerm('');
              pushSnackbarMessage('success', '全ての学期の授業が表示されます');
            } else {
              setMode('timeTable');
              setFilterTerm(targetEnrolledTerm);
              pushSnackbarMessage(
                'success',
                `${targetEnrolledTerm}の授業が絞り込まれました`
              );
            }
          }}
        >
          <Chip
            sx={{
              height: 36,
              width: 145,
              opacity: 1,
              backgroundColor: 'grey.200',
            }}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', opacity: 1 }}>
                {mode === 'timeTable' ? (
                  <Checklist sx={{ height: 20, width: 20 }} />
                ) : (
                  <CalendarMonth sx={{ height: 20, width: 20 }} />
                )}

                <Typography
                  variant="xx-small"
                  sx={{ whiteSpace: 'nowrap', color: 'black', ml: 1.5 }}
                >
                  {mode === 'timeTable' ? '取得状況' : '時間割'}
                </Typography>
              </Box>
            }
          />
        </Button>

        <Box sx={{ display: 'flex', gap: 1, ml: 'auto', mr: 2 }}>
          <Button
            onClick={() => {
              setIsUsageNotesModalOpen(true);
            }}
          >
            <Typography variant="x-small">このアプリについて</Typography>
          </Button>

          <Button>
            <Link
              href="https://x.com/gundainodaba/status/1913962937691312280"
              target="_blank"
              underline="none"
            >
              <Typography variant="x-small">使い方</Typography>
            </Link>
          </Button>

          <Button
            onClick={() => {
              setIsShareModalOpen(true);
            }}
          >
            <Typography variant="x-small">共有</Typography>
          </Button>

          <Button onClick={() => setIsSettingsModalOpen(true)}>
            <Typography variant="x-small">設定</Typography>
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 5 }}>
        {mode === 'courseManagement' && <CourseManagement />}
        {mode === 'timeTable' && <Timetable />}
      </Box>
    </Box>
  );
});

const DoublePanel = () => {
  const { updateCourse } = useCourses();

  const [dragCourse, setDragCourse] = useState<Course | null>(null);

  const targetEnrolledYear = useAtomValue(targetEnrolledYearAtom);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 1, // 1px ドラッグした時にソート機能を有効にする
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, keyboardSensor);

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setDragCourse(active.data.current as Course);
    if (active.data.current == null) {
      return;
    }
  };
  const onDragEnd = (event: DragEndEvent) => {
    // DragOverRayで表示されるコースをnullにする
    setDragCourse(null);

    const { over, active } = event;
    if (over == null || active.data.current == null) {
      return;
    }
    switch (over.id) {
      case 'timeTable': {
        const course = active.data.current as Course;
        updateCourse({ ...course, enrolled_year: targetEnrolledYear });
        break;
      }
      default:
        break;
    }
  };
  return (
    <DndContext
      onDragStart={(event: DragEndEvent) => onDragStart(event)}
      onDragEnd={(event: DragEndEvent) => onDragEnd(event)}
      sensors={sensors}
      autoScroll={false}
    >
      <Box sx={{ display: 'flex' }}>
        <LeftPanel />
        <RightPanel />
      </Box>
      <DragOverlay>
        {dragCourse && <CourseItem course={dragCourse} />}
      </DragOverlay>
    </DndContext>
  );
};

export default memo(DoublePanel);
