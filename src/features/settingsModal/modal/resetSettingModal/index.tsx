import { Box, Button, ButtonGroup, Typography } from '@mui/material';

import { SmallModal } from '@/components/CustomModal';
import { useCourses } from '@/hooks/course';
import { useFacultyRequirements } from '@/hooks/facultyRequirement';
import { useLocalStorageManagement } from '@/hooks/localStorageManagement';

import { useResetConfirmModal } from './hooks';

export default function ResetConfirmModal() {
  const [data, setData] = useResetConfirmModal();
  const { setCourses } = useCourses();
  const { setFacultyRequirements } = useFacultyRequirements();
  const { localPastCourseIds, resetLocalStorages } =
    useLocalStorageManagement();

  let comfirmText = '';

  switch (data?.mode) {
    case 'setting':
      switch (data?.data) {
        case 'all':
          comfirmText =
            '登録されている全ての情報（学部・必修・選択必修・タグ・取得済みの授業・時間割に登録している授業・教室）を';
          break;
        case 'obtained':
          comfirmText = '登録されている取得済みの授業の情報を全て';
          break;
        case 'fucultyRequirements':
          comfirmText =
            '登録されている学部情報（学部・必修・選択必修・タグ）の情報を全て';
          break;
      }
      break;
  }

  const comfirmReset = () => {
    switch (data?.mode) {
      case 'setting':
        switch (data?.data) {
          case 'all': {
            setCourses((prevCurses) =>
              prevCurses
                .map((course) => ({
                  ...course,
                  obtained: false,
                  required: false,
                  enrolled_year: null,
                }))
                // 過去の授業を除外
                .filter(
                  (course) => !localPastCourseIds.includes(course.course_id)
                )
            );

            setFacultyRequirements([]);

            resetLocalStorages({
              facultyRequirements: true,
              tags: true,
              obtainedCourseIds: true,
              courseEnrolledYears: true,
              pastCourseIds: true,
              classrooms: true,
            });
            window.location.reload();
            break;
          }
          case 'obtained':
            setCourses((course) =>
              course.map((course) => ({
                ...course,
                obtained: false,
              }))
            );
            resetLocalStorages({ obtainedCourseIds: true });
            break;
          case 'fucultyRequirements':
            resetLocalStorages({ facultyRequirements: true, tags: true });
            // ページをリロードして再度学部情報の入力を求める
            window.location.reload();
            break;
        }
        break;
    }
  };

  return (
    data && (
      <SmallModal open={!!data} onClose={() => setData(null)}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="x-small">{comfirmText}削除します。</Typography>
          <Typography variant="x-small">本当によろしいですか？</Typography>
          <ButtonGroup>
            <Button
              onClick={() => {
                setData(null);
              }}
              sx={{ width: '50%' }}
            >
              <Typography variant="xx-small">キャンセル</Typography>
            </Button>
            <Button
              onClick={() => {
                comfirmReset();

                setData(null);
              }}
              sx={{ width: '50%' }}
            >
              <Typography variant="xx-small">確定</Typography>
            </Button>
          </ButtonGroup>
        </Box>
      </SmallModal>
    )
  );
}
