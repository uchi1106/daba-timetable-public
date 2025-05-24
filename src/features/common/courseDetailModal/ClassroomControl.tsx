import {
  Box,
  Button,
  Menu,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { FC, memo, useState } from 'react';

import { useClassroom } from '@/hooks/classroom';
import { useCourses } from '@/hooks/course';
import { Course } from '@/types/course';
interface ClassroomControlProp {
  courseData: Course;
  setCourseData: (data: Course | null) => void;
}

const ClassroomControl: FC<ClassroomControlProp> = ({
  courseData,
  setCourseData,
}) => {
  const { updateCourse } = useCourses();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [editClassroom, setEditClassroom] = useState<string>(
    courseData.classroom || ''
  );

  const { classrooms, enrollClassroom } = useClassroom();

  const theme = useTheme();
  const isLapTop = useMediaQuery(theme.breakpoints.up('laptop'));

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleEnroll = () => {
    // 教室が入力された場合
    if (editClassroom !== '') {
      const updatedCourse = {
        ...courseData,
        classroom: editClassroom,
      } as Course;

      setCourseData(updatedCourse);
      updateCourse(updatedCourse);

      // 登録されている教室が異なる場合
      if (courseData.classroom !== editClassroom) {
        // APIを呼び出して教室をデータベースに登録
        enrollClassroom({
          course_id: courseData.course_id,
          classroom: editClassroom,
        });
      }
    } else {
      const updatedCourse = {
        ...courseData,
        classroom: null,
      } as Course;
      setCourseData(updatedCourse);
      updateCourse(updatedCourse);
    }
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',

        width: isLapTop ? '100%' : '100%',
        mx: isLapTop ? 2 : 0,
        px: isLapTop ? 2 : 1,
        py: isLapTop ? 1 : 0.5,
        backgroundColor: blue[50],
        borderRadius: 1,
        border: '1px solid',
        borderColor: blue[100],
      }}
    >
      {!isEditing ? (
        <>
          <Typography
            variant="x-small"
            sx={{ my: 1, mr: isLapTop ? 2 : 1, whiteSpace: 'nowrap' }}
          >
            教室:
          </Typography>
          {editClassroom ? (
            <Typography variant="x-small">{courseData.classroom}</Typography>
          ) : (
            <Typography variant="x-small">未設定</Typography>
          )}

          <Button
            sx={{
              py: { mobile: 0.25, laptop: 0.5 },
              px: { mobile: 0, laptop: 1 },
              ml: 'auto',
            }}
            onClick={() => setIsEditing(true)}
          >
            <Typography variant="x-small" sx={{ color: 'black' }}>
              編集
            </Typography>
          </Button>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: isLapTop ? 'row' : 'column',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: isLapTop ? 'auto' : '100%',
              mb: isLapTop ? 0 : 0.5,
            }}
          >
            <Typography
              variant="x-small"
              sx={{ my: 1, mr: isLapTop ? 2 : 1, whiteSpace: 'nowrap' }}
            >
              教室:
            </Typography>

            <TextField
              fullWidth
              size={'small'}
              value={editClassroom}
              onChange={(e) => {
                setEditClassroom(e.target.value);
              }}
              placeholder="教室名を入力"
              sx={{
                input: {
                  fontSize: isLapTop ? '16px' : '10px',
                  '&::placeholder': {
                    fontSize: isLapTop ? '16px' : '10px',
                  },
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: isLapTop ? 'flex-start' : 'center',
            }}
          >
            <Button
              sx={{
                py: { mobile: 0.25, laptop: 0.5 },
                px: { mobile: 1, laptop: 1 },
                ml: isLapTop ? 2 : 0,
                display: 'flex',
                alignItems: 'center',
              }}
              disabled={classrooms.length === 0}
              variant="outlined"
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
              }}
            >
              <Typography variant="x-small">みんなの教室</Typography>
            </Button>

            <Button
              sx={{
                ml: isLapTop ? 'auto' : 2,
                py: { mobile: 0.25, laptop: 0.5 },
                px: { mobile: 0, laptop: 1 },
              }}
              variant="outlined"
              onClick={() => handleEnroll()}
            >
              <Typography variant="x-small" sx={{ wrap: 'nowrap' }}>
                保存
              </Typography>
            </Button>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
          >
            <Box sx={{ px: 2, py: isLapTop ? 1 : 0.5 }}>
              <Typography variant="x-small" color="textSecondary">
                この授業で他の人が登録している教室
              </Typography>
            </Box>
            {classrooms.map((classroom, index) => (
              <MenuItem
                key={classroom}
                onClick={() => {
                  setAnchorEl(null);
                  setEditClassroom(classroom);
                }}
              >
                <Typography variant="x-small">{classroom}</Typography>
                {/* 条件に応じてラベルを表示 */}
                <Typography
                  variant="x-small"
                  color="textSecondary"
                  sx={{ ml: isLapTop ? 'auto' : 2 }}
                >
                  {index === 0
                    ? '最も多くが登録'
                    : index === 1
                      ? '登録多数'
                      : ''}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}
    </Box>
  );
};

export default memo(ClassroomControl);
