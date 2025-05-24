import ClearIcon from '@mui/icons-material/Clear';
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { LargeModal } from '@/components/CustomModal';
import { OVERLAP_NAME_COURSES } from '@/constants/course';
import { useCourses } from '@/hooks/course';
import { useFacultyRequirements } from '@/hooks/facultyRequirement';
import { useSnackbar } from '@/hooks/snackbar';

import { useEditRequiredCourseModal } from './hooks';

export default function RequiredCourseEnrollmentModal() {
  const { pushSnackbarMessage } = useSnackbar();
  const [isOpen, setIsOpen] = useEditRequiredCourseModal();

  const { courses, setCourses } = useCourses();

  const { facultyRequirements, updateFacultyRequirement } =
    useFacultyRequirements();

  // 授業名が重複していない授業のリスト
  const uniqueCourses = courses.filter(
    (course) => !OVERLAP_NAME_COURSES.includes(course.course_name)
  );

  const [requiredCourseNames, setRequiredCourseNames] = useState<string[]>(
    facultyRequirements.at(-1)?.requiredCourseNames || []
  );

  useEffect(() => {
    setRequiredCourseNames(
      facultyRequirements.at(-1)?.requiredCourseNames || []
    );
  }, [facultyRequirements]);

  const [selectedCourseNames, setSelectedCourseNames] = useState<string[]>([]);

  // TODO: 情報学部だけじゃなく、教養教育にも必修が登録できるような柔軟な実装にする
  const handleEnrollment = () => {
    // 変更前の必修の授業の名前のリスト

    // 重複を除いた新しい必修の授業名のリスト
    const newRequiredCourseNames = Array.from(
      new Set([...selectedCourseNames, ...requiredCourseNames])
    );

    const newCourses = courses.map((course) => {
      if (newRequiredCourseNames.includes(course.course_name)) {
        return { ...course, required: true };
      }
      return { ...course, required: false };
    });

    setCourses(newCourses);

    // 状態変数及びローカルストレージの更新
    if (facultyRequirements.at(-1)) {
      const lastRequirement = facultyRequirements.at(-1)!;
      updateFacultyRequirement({
        ...lastRequirement,
        facultyRequirementId: lastRequirement.facultyRequirementId ?? null, // undefinedをnullに
        requiredCourseNames: newRequiredCourseNames,
      });
    }

    // モーダルを閉じる
    setIsOpen(false);
    // 必修のコースの表示を更新
    setRequiredCourseNames(newRequiredCourseNames);
    // 選択されたコースをリセット
    setSelectedCourseNames([]);

    pushSnackbarMessage('success', '必修の授業の登録が完了しました');
  };

  return (
    <LargeModal open={isOpen} onClose={() => setIsOpen(false)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 1 }}>
            <Typography>
              入力された授業名から必修の授業を登録します。「保存」を押すと変更が確定します
            </Typography>
            <Typography>
              現在必修として登録されている授業の「✕」を押すとその授業を必修から外します。
            </Typography>
            <Typography>
              注：授業名が重複している授業は必修に登録することができません
            </Typography>
          </Box>

          <Autocomplete
            multiple
            freeSolo
            options={uniqueCourses.map((course) => course.course_name)}
            getOptionLabel={(course_name) => course_name}
            renderInput={(params) => (
              <TextField {...params} label="授業名を選択してください" />
            )}
            value={selectedCourseNames}
            onChange={(_event, newValue) => {
              setSelectedCourseNames(newValue);
            }}
            autoSelect
          />
        </Box>

        <Box
          sx={{ display: 'flex', flexWrap: 'wrap', overflowY: 'auto', mt: 1 }}
        >
          {requiredCourseNames.map((course_name) => (
            <Box
              key={course_name}
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: 'calc(50% - 1rem)',
              }}
            >
              <Button
                sx={{ py: 0.25, px: 0 }}
                onClick={() => {
                  setRequiredCourseNames(
                    requiredCourseNames.filter(
                      (requiredCourseName) => requiredCourseName !== course_name
                    )
                  );
                }}
              >
                <ClearIcon />
              </Button>

              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="x-small">{course_name}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* TODO: ↑のrequiredCoursesで選択されていない授業のみ選択できるように動的に管理した方がいいかも */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <ButtonGroup sx={{ mt: 1 }}>
            <Button
              onClick={() => {
                setIsOpen(false);
                setRequiredCourseNames(
                  facultyRequirements.at(-1)?.requiredCourseNames || []
                );
              }}
              sx={{ width: '50%' }}
            >
              キャンセル
            </Button>
            <Button
              onClick={() => {
                handleEnrollment();
              }}
              sx={{ width: '50%' }}
            >
              保存
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
    </LargeModal>
  );
}
