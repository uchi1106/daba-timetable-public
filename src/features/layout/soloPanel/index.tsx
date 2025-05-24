import {
  CalendarMonth,
  Checklist,
  FormatListBulleted,
} from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { memo } from 'react';

import AllCourses from '@/features/allCourses';
import { useShareModal } from '@/features/common/shareModal/hook';
import { useUsageNotesModal } from '@/features/common/usageNotesModal/hook';
import { CourseManagement } from '@/features/courseManagement';
import { useSettingsModal } from '@/features/settingsModal/hook';
import Timetable from '@/features/timeTable';
import { panelModeAtom } from '@/hooks/panelMode';
// TODO: フォルダ名をsinglePanelにするとなぜかエラー「Element type is invalid: expected a string」が出るため、soloPanelにしている。singlePanelに変更する方法を調査
const SinglePanel = () => {
  const [mode, setMode] = useAtom(panelModeAtom);
  const [, setIsSettingsModalOpen] = useSettingsModal();
  const [, setIsShareModalOpen] = useShareModal();
  const [, setIsUsageNotesModalOpen] = useUsageNotesModal();

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          position: 'sticky',
          top: 0,
          width: '100%',
          backgroundColor: 'grey.200',
          borderBottom: 1,
          borderColor: 'divider',
          pt: 0.5,
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            mx: 1,
            width: '100%',
            columnGap: 0.5,
            mr: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button
            sx={{ px: 1, minWidth: 0 }}
            onClick={() => setIsUsageNotesModalOpen(true)}
          >
            <Typography variant="x-small" sx={{ color: 'black' }}>
              このアプリについて
            </Typography>
          </Button>

          <Button
            component="a"
            href="https://x.com/gundainodaba/status/1913962937691312280"
            target="_blank"
            sx={{ px: 1, minWidth: 0, textDecoration: 'none' }}
          >
            <Typography variant="x-small" sx={{ color: 'black' }}>
              使い方
            </Typography>
          </Button>

          <Button
            sx={{ px: 2, minWidth: 0 }}
            onClick={() => setIsShareModalOpen(true)}
          >
            <Typography variant="x-small" sx={{ color: 'black' }}>
              共有
            </Typography>
          </Button>
          <Button
            sx={{ px: 2, minWidth: 0 }}
            onClick={() => setIsSettingsModalOpen(true)}
          >
            <Typography variant="x-small" sx={{ color: 'black' }}>
              設定
            </Typography>
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 1, pb: 9 }}>
        {mode === 'allCourses' && <AllCourses />}
        {mode === 'courseManagement' && <CourseManagement />}
        {mode === 'timeTable' && <Timetable />}
      </Box>

      <Box
        sx={{
          position: 'fixed',
          display: 'flex',
          width: '100%',
          height: 'calc(60px + env(safe-area-inset-bottom))',
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          bottom: 0,
        }}
      >
        <Button
          sx={{ width: 'calc(100% / 3)', height: '60px', gap: 1 }}
          onClick={() => setMode('allCourses')}
        >
          <Typography variant="x-small" sx={{ color: 'black' }}>
            授業一覧
          </Typography>
          <FormatListBulleted />
        </Button>

        <Button
          sx={{ width: 'calc(100% / 3)', height: '60px', gap: 1 }}
          onClick={() => setMode('timeTable')}
        >
          <Typography variant="x-small" sx={{ color: 'black' }}>
            時間割
          </Typography>
          <CalendarMonth />
        </Button>

        <Button
          sx={{ width: 'calc(100% / 3)', height: '60px', gap: 1 }}
          onClick={() => setMode('courseManagement')}
        >
          <Typography variant="x-small" sx={{ color: 'black' }}>
            取得状況
          </Typography>
          <Checklist />
        </Button>
      </Box>
    </Box>
  );
};

export default memo(SinglePanel);
