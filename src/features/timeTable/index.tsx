import { useDroppable } from '@dnd-kit/core';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {
  Box,
  Button,
  Popover,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAtom } from 'jotai';
import { FC, memo, useState } from 'react';

import CourseItem from '@/features/common/CourseItem';
import { controlTimeTable } from '@/features/timeTable/controlTimeTable';
import { useCourses } from '@/hooks/course';
import { filterTermAtom } from '@/hooks/filterSchedule';
import { useSnackbar } from '@/hooks/snackbar';
import { targetEnrolledTermAtom } from '@/hooks/term';

import { targetEnrolledYearAtom } from '../.././hooks/year';
import BulkClassroomEnrollModal from './bulkEnrollClassroomModal';
import { useBulkClassroomEnrollModal } from './bulkEnrollClassroomModal/hook';
import TimeTableGrid from './TimeTableGrid';

const TimeTable: FC = () => {
  const [targetTerm, setTargetTerm] = useAtom(targetEnrolledTermAtom);
  const [targetEnrolledYear, setTargetEnrolledYear] = useAtom(
    targetEnrolledYearAtom
  );

  const theme = useTheme();
  const isLapTop = useMediaQuery(theme.breakpoints.up('laptop'));

  const { pushSnackbarMessage } = useSnackbar();
  const [, setFilterTerm] = useAtom(filterTermAtom);

  const [, setData] = useBulkClassroomEnrollModal();

  const { courses, setCourses } = useCourses();

  const { targetTermCourses, coursesTable, overCourses } = controlTimeTable(
    courses,
    targetEnrolledYear,
    targetTerm
  );

  const sumCredits: number = targetTermCourses.reduce((acc, course) => {
    return acc + (course.credits ?? 0);
  }, 0);

  // ドロップ可能な要素としてTimeTableを設定するために設定
  const { isOver, setNodeRef } = useDroppable({
    id: 'timeTable',
  });

  const style = {
    backgroundColor: isOver ? 'lightblue' : undefined,
  };

  const setNextTerm = () => {
    if (targetTerm === '前期') {
      setTargetTerm('後期');
      if (isLapTop) {
        setFilterTerm('後期');
        pushSnackbarMessage('success', '後期の授業が絞り込まれました');
      }
    } else {
      setTargetEnrolledYear((prev) => prev + 1);
      setTargetTerm('前期');
      if (isLapTop) {
        setFilterTerm('前期');
        pushSnackbarMessage('success', '前期の授業が絞り込まれました');
      }
    }
  };

  const setPreviousTerm = () => {
    if (targetTerm === '後期') {
      setTargetTerm('前期');
      if (isLapTop) {
        setFilterTerm('前期');
        pushSnackbarMessage('success', '前期の授業が絞り込まれました');
      }
    } else {
      setTargetEnrolledYear((prev) => prev - 1);
      setTargetTerm('後期');
      if (isLapTop) {
        setFilterTerm('前期');
        pushSnackbarMessage('success', '前期の授業が絞り込まれました');
      }
    }
  };

  const [tempObtainedAnchorEl, setTempObtainedAnchorEl] =
    useState<HTMLElement | null>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setTempObtainedAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setTempObtainedAnchorEl(null);
  };

  return (
    <Box ref={setNodeRef} style={style} sx={{ pb: 1 }}>
      {/* 年度と開講期を選択 */}
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          justifyContent: 'flex-end',
          alignItems: 'center',
          width: '100%',
          minHeight: { mobile: 32, laptop: 56 }, // 高さはお好みで
        }}
      >
        {/* 中央表示エリア */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <Button
            onClick={() => setPreviousTerm()}
            sx={{
              padding: 0,
              minWidth: 'auto',
              width: { mobile: 30, laptop: 40 },
              height: { mobile: 30, laptop: 40 },
              mr: 1,
            }}
          >
            <ArrowLeftIcon sx={{ fontSize: { mobile: 40, laptop: 50 } }} />
          </Button>

          <Typography variant="x-large">
            {targetEnrolledYear}年度 {targetTerm}
          </Typography>

          <Button
            onClick={() => setNextTerm()}
            sx={{
              padding: 0,
              minWidth: 'auto',
            }}
          >
            <ArrowRightIcon sx={{ fontSize: { mobile: 40, laptop: 50 } }} />
          </Button>
        </Box>

        <Typography
          sx={{
            position: 'absolute',
            right: { mobile: 10, laptop: 16 }, // 右端からの余白
            bottom: 6,
            zIndex: 1,
          }}
          variant="medium"
        >
          {sumCredits}単位
        </Typography>
      </Box>

      {/* 時間割 */}
      <TimeTableGrid coursesTable={coursesTable} />
      <Box
        sx={{
          mt: 0.5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Button
          sx={{ ml: 1 }}
          variant="outlined"
          onClick={() => {
            const noneClassroomCourses = targetTermCourses
              .filter((course) => course.classroom === null)
              .map((course) => course.course_id);
            // 教室が登録されていない授業をまとめて登録
            setData(noneClassroomCourses);
          }}
        >
          <Typography variant="xx-small">まとめて教室を登録</Typography>
        </Button>

        {isLapTop && (
          <>
            <Button
              sx={{ ml: 5 }}
              variant="outlined"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                const targetTermCourseIds = targetTermCourses.map(
                  (course) => course.course_id
                );
                setCourses((prevCourses) => {
                  return prevCourses.map((course) => ({
                    ...course,
                    obtained: targetTermCourseIds.includes(course.course_id)
                      ? true
                      : course.obtained,
                  }));
                });
                pushSnackbarMessage(
                  'success',
                  `${targetEnrolledYear}年度 ${targetTerm}の授業を仮取得済みにしました`
                );
              }}
            >
              <Typography variant="xx-small">仮取得済みにする</Typography>
            </Button>
            <Popover
              open={Boolean(tempObtainedAnchorEl)}
              anchorEl={tempObtainedAnchorEl}
              onClose={handleMouseLeave}
              transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              disableRestoreFocus
              sx={{ pointerEvents: 'none' }} // Popover自体にマウスイベントを渡さない
            >
              <Box sx={{ p: 2, maxWidth: 400 }}>
                <Typography variant="xx-small">
                  時間割のこの学期に登録されている授業を仮取得済みの状態にします。
                  仮取得済みの授業は、リロードすると元の状態に戻ります。
                </Typography>
              </Box>
            </Popover>

            <Button
              sx={{ ml: 1 }}
              variant="outlined"
              onClick={() => {
                setCourses((prevCourses) => {
                  return prevCourses.map((course) => ({
                    ...course,
                    obtained:
                      course.enrolled_year === targetEnrolledYear &&
                      course.dates.some((date) => {
                        return date.term === targetTerm;
                      })
                        ? false
                        : course.obtained,
                  }));
                });
                pushSnackbarMessage(
                  'success',
                  `${targetEnrolledYear}年度 ${targetTerm}の授業の仮取得済みを解除しました`
                );
              }}
            >
              <Typography variant="xx-small">元に戻す</Typography>
            </Button>
          </>
        )}
      </Box>

      {/* 時間割のデータがないか重複している授業を表示 */}

      <Box sx={{ mt: { mobile: 1, laptop: 2 }, mx: 1 }}>
        <Typography variant="medium">
          重複または時間割データが存在しない授業
        </Typography>
        <Box
          sx={{ display: 'flex', flexDirection: 'column', rowGap: 1, mt: 1 }}
        >
          {overCourses.map((course, index) => (
            // TODO: CourseItemを使わない。ドラッグできてしまうため。
            <CourseItem key={`overCourses${index}`} course={course} />
          ))}
        </Box>
      </Box>

      <BulkClassroomEnrollModal />
    </Box>
  );
};

export default memo(TimeTable);
