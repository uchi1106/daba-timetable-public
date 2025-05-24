import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { FC, memo } from 'react';

import { DAY_OF_WEEKS } from '@/constants/days';

import { timeMap } from './constants';
import { CourseOrNull } from './controlTimeTable';
import TimeTableCourseCell from './TimeTableCourseCell';

interface TimeTableGridProps {
  coursesTable: CourseOrNull[][];
}

const TimeTableGrid: FC<TimeTableGridProps> = ({ coursesTable }) => {
  // 時間割に表示される授業のコマのリスト（重複を削除）
  const periods = new Set(
    coursesTable
      .map((row) =>
        row.map((courses) =>
          courses?.dates.map((date) => date.period.map((time) => time))
        )
      )
      .flat(Infinity)
  );

  // 時間割に表示される授業の曜日のリスト（重複を削除）
  const availableDays = new Set(
    coursesTable
      .map((row) =>
        row.map((courses) => courses?.dates.map((date) => date.day))
      )
      .flat(Infinity)
  );

  return (
    <TableContainer
      component={Paper}
      sx={{
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 0, // 角を丸くしたくない場合
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <Table
        aria-label="simple table"
        sx={{
          tableLayout: 'fixed',
        }}
      >
        <TableHead>
          <TableRow>
            {/* 左上の空白のセル */}
            <TableCell
              align="center"
              sx={{
                width: { mobile: '35px', laptop: '50px' },
                borderRight: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            />

            {/* 曜日を表示するセル */}
            {DAY_OF_WEEKS.map(
              (day) =>
                // 土曜日の授業がない場合、土曜日の列を表示しない
                (day !== '土' || availableDays.has('土')) && (
                  <TableCell
                    align="center"
                    sx={{
                      maxWidth: '30px',
                      py: { mobile: 0, laptop: 0.5 },
                      px: { mobile: 0, laptop: 1 },
                      borderRight: (theme) =>
                        `1px solid ${theme.palette.divider}`,
                    }}
                    key={day}
                  >
                    <Typography variant="xx-small">{day[0]}</Typography>
                  </TableCell>
                )
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {coursesTable.map((row, rowIndex) => {
            // 6コマ目、7コマ目の授業がない場合、6コマ目、7コマ目の行を表示しない
            if (rowIndex <= 4 || periods.has(6) || periods.has(7)) {
              return (
                <TableRow key={rowIndex}>
                  {/* コマと時間を表示する列 */}
                  <TableCell
                    sx={{
                      borderRight: (theme) =>
                        `1px solid ${theme.palette.divider}`,
                      width: 0, // 幅を0に設定
                      whiteSpace: 'pre-wrap',
                      padding: 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        rowGap: 0.5,
                      }}
                    >
                      {/* コマ */}
                      <Typography variant="x-small">
                        {timeMap.get(rowIndex)?.period}
                      </Typography>

                      {/* 時間 */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          rowGap: 0,
                        }}
                      >
                        {/* 始まる時間 */}
                        <Typography
                          variant="xx-small"
                          sx={{ lineHeight: 1, whiteSpace: 'nowrap' }}
                        >
                          {timeMap.get(rowIndex)?.startTime}
                        </Typography>
                        <Typography variant="xx-small" sx={{ lineHeight: 1 }}>
                          ～
                        </Typography>
                        {/* 終わる時間 */}
                        <Typography
                          variant="xx-small"
                          sx={{ lineHeight: 1, whiteSpace: 'nowrap' }}
                        >
                          {timeMap.get(rowIndex)?.endTime}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* 授業を表示する列 */}
                  {row.map(
                    (course, cellIndex) =>
                      (cellIndex !== 5 || availableDays.has('土')) && (
                        <TimeTableCourseCell
                          key={cellIndex}
                          course={course}
                          day={DAY_OF_WEEKS[cellIndex]}
                          // コマは１から始まるため、cellIndex + 1とする
                          period={rowIndex + 1}
                        />
                      )
                  )}
                </TableRow>
              );
            }
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default memo(TimeTableGrid);
