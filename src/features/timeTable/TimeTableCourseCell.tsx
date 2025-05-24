import { Box, Button, TableCell, Typography } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { FC, memo } from 'react';

import {
  filterDayAtom,
  filterPeriodAtom,
  filterTermAtom,
} from '@/hooks/filterSchedule';
import { panelModeAtom } from '@/hooks/panelMode';
import { useSnackbar } from '@/hooks/snackbar';
import { targetEnrolledTermAtom } from '@/hooks/term';

import { useCourseDetailModal } from '../common/courseDetailModal/hook';
import { CourseOrNull } from './controlTimeTable';

interface TimeTableCourseCellProps {
  course: CourseOrNull;
  day: string;
  period: number;
}

const TimeTableCourseCell: FC<TimeTableCourseCellProps> = ({
  course,
  day,
  period,
}) => {
  const [, setPanelMode] = useAtom(panelModeAtom);
  const [, setCourseData] = useCourseDetailModal();

  const targetTerm = useAtomValue(targetEnrolledTermAtom);
  const [, setFilterTerm] = useAtom(filterTermAtom);
  const { pushSnackbarMessage } = useSnackbar();

  const [, setFilterDay] = useAtom(filterDayAtom);
  const [, setFilterPeriod] = useAtom(filterPeriodAtom);

  return (
    <TableCell
      key={course?.course_id}
      sx={{
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        width: '10px',
        height: { mobile: '12.5vh', laptop: '15vh' },
        padding: 0,
      }}
      onClick={() => {
        if (course) {
          setCourseData(course);
        } else {
          setFilterDay([day]);
          setFilterPeriod([period]);
          setFilterTerm(targetTerm);
          setPanelMode('allCourses');
          pushSnackbarMessage(
            'success',
            `${targetTerm} ${day}曜日 ${period}コマ目の授業が絞り込まれました`
          );
        }
      }}
    >
      <Button
        sx={{
          width: '100%',
          minWidth: 0,
          height: '100%',
          py: { mobile: '1px', laptop: 0.5 },
          px: { mobile: '2.5px', laptop: 0.75 },
        }}
      >
        {course && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            {/* 授業名 */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <Typography
                sx={{
                  position: 'relative',
                  lineHeight: 1.3,
                  fontSize: { mobile: 10, laptop: 14 },
                  color: 'black',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3, // 3行でカット
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {course.course_name}
              </Typography>
            </Box>

            {/* 教室 */}
            <Typography
              sx={{
                lineHeight: 1.3,
                fontSize: { mobile: 8, laptop: 12 },
                color: 'black',
              }}
            >
              {course.classroom || '教室:未設定'}
            </Typography>
          </Box>
        )}
      </Button>
    </TableCell>
  );
};

export default memo(TimeTableCourseCell);
