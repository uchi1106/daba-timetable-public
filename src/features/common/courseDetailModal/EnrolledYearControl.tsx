import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Box,
  Button,
  Chip,
  FormControl,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { green } from '@mui/material/colors';
import { useAtomValue } from 'jotai';
import { FC, memo, useState } from 'react';

import { useCourses } from '@/hooks/course';
import { targetEnrolledYearAtom } from '@/hooks/year';
import { Course } from '@/types/course';
interface EnrollYearControlProp {
  courseData: Course;
  setCourseData: (data: Course | null) => void;
}

const EnrollYearControl: FC<EnrollYearControlProp> = ({
  courseData,
  setCourseData,
}) => {
  const { updateCourse } = useCourses();
  const targetEnrolledYear = useAtomValue(targetEnrolledYearAtom);

  const theme = useTheme();
  const isLapTop = useMediaQuery((theme) => theme.breakpoints.up('laptop'));

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (year: number) => {
    const updatedCourse = {
      ...courseData,
      enrolled_year: year,
    } as Course;
    setCourseData(updatedCourse);
    updateCourse(updatedCourse);
    handleClose();
  };
  return (
    <>
      {courseData.enrolled_year ? (
        // 登録済の場合
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <Chip
            sx={{
              backgroundColor: green[600],
              color: theme.palette.getContrastText(green[600]),
              height: { mobile: 22, laptop: 34 },
            }}
            label={
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: { mobile: 10, laptop: 16 },
                  pt: { mobile: 0.25, laptop: 0 },
                }}
              >
                {courseData.dates.length == 1
                  ? `${courseData.enrolled_year}年（${courseData.dates[0].term}）に登録済`
                  : `${courseData.enrolled_year}年に登録済`}
              </Typography>
            }
          />

          <Button
            color="error"
            variant="outlined"
            sx={{
              py: { mobile: 0.25, laptop: 0.5 },
              px: { mobile: 0, laptop: 1 },
            }}
            onClick={() => {
              const updatedCourse = {
                ...courseData,
                enrolled_year: null,
              };
              //モーダルの表示を更新
              setCourseData(updatedCourse);
              //全体のデータを更新
              updateCourse(updatedCourse);
            }}
          >
            <Typography variant="x-small">解除</Typography>
          </Button>
        </Box>
      ) : (
        // 未登録の場合
        <Box sx={{ display: 'flex', columnGap: 3, alignItems: 'center' }}>
          <Button
            sx={{
              py: { mobile: 0.25, laptop: 0.5 },
              px: { mobile: 1, laptop: 1 },
            }}
            variant="outlined"
            onClick={() => {
              const updatedCourse = {
                ...courseData,
                enrolled_year: targetEnrolledYear,
              };
              //モーダルの表示を更新
              setCourseData(updatedCourse);
              //全体のデータを更新
              updateCourse(updatedCourse);
            }}
          >
            <Typography variant="x-small" sx={{ wrap: 'nowrap' }}>
              {targetEnrolledYear}年に登録
            </Typography>
          </Button>

          <FormControl size={isLapTop ? 'medium' : 'small'}>
            <Button
              variant="outlined"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                py: { mobile: 0.25, laptop: 0.5 },
                pl: 1,
                pr: 0.5,
                textTransform: 'none',
                backgroundColor: 'white',
                color: 'black',
                borderColor: 'black',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="x-small">別の年度</Typography>
                <KeyboardArrowDownIcon
                  sx={{ fontSize: { mobile: 16, laptop: 24 } }}
                />
              </Box>
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
            >
              {Array.from(
                { length: 7 },
                (_, i) => targetEnrolledYear - 3 + i
              ).map((year) => (
                <MenuItem
                  key={year}
                  selected={year === courseData.enrolled_year}
                  onClick={() => handleMenuItemClick(year)}
                >
                  {year}年度
                </MenuItem>
              ))}
            </Menu>
          </FormControl>
        </Box>
      )}
    </>
  );
};

export default memo(EnrollYearControl);
