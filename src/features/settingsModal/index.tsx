import { Box, Button, Typography } from '@mui/material';

import { LargeModal } from '@/components/CustomModal';
import { useCourses } from '@/hooks/course';
import { useFacultyRequirements } from '@/hooks/facultyRequirement';
import { Course } from '@/types/course';

import { useCourseDetailModal } from '../common/courseDetailModal/hook';
import { FacultyRequirementSetting } from './FacultyRequirementSetting';
import { useSettingsModal } from './hook';
import { useAddElectiveRequirementModal } from './modal/addElectiveRequirementModal/hook';
import { useAddObtainedCoursesModal } from './modal/addObtainedCoursesModal/hook';
import { useEditRequiredCourseModal } from './modal/editRequiredCourseModal/hooks';
import { useLocalStorageSettingModal } from './modal/localStorageSettingModal/hook';
import { useTagToCoursesModal } from './modal/tagToCoursesModal/hooks';
import { SettingButtons } from './SettingButtons';

export default function SettingsModal() {
  const [isOpen, setIsOpen] = useSettingsModal();

  const [, setCourseData] = useCourseDetailModal();

  const [, setTagToCoursesModalOpen] = useTagToCoursesModal();
  const [, setAddObtainedCoursesModalOpen] = useAddObtainedCoursesModal();
  const [, setLocalStorageSettingModal] = useLocalStorageSettingModal();
  const [, setElectiveRequirementRegistrationModal] =
    useAddElectiveRequirementModal();
  const [, setRequiredCourseEnrollmentModal] = useEditRequiredCourseModal();
  const { facultyRequirements } = useFacultyRequirements();
  const { courses } = useCourses();

  const obrainedCourses = courses.filter((course) => course.obtained);
  const requiredCourses = courses.filter((course) => course.required);
  const enrolledCourses = courses.filter((course) => !!course.enrolled_year);

  const groupedEnrolledCoursesKeys = new Set<number>(
    enrolledCourses.map((course) => course.enrolled_year ?? -1)
  );
  const groupedEnrolledCourses = new Map<number, Course[]>(
    [...groupedEnrolledCoursesKeys].map((year) => [
      year,
      enrolledCourses.filter((course) => course.enrolled_year === year),
    ])
  );

  return (
    <LargeModal open={isOpen} onClose={() => setIsOpen(false)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: { mobile: 1.5, laptop: 4 },
        }}
      >
        {/* タイトル・設定のコピー・設定の削除 */}
        <Box sx={{ display: 'flex' }}>
          <Typography variant="large">各種設定</Typography>

          <SettingButtons />
        </Box>

        {/* 各種設定のボタン */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <Button
              sx={{ width: '50%', px: { mobile: 0.75, laptop: 1 } }}
              onClick={() => {
                setAddObtainedCoursesModalOpen(true);
              }}
            >
              <Typography variant="x-small">
                授業を一括で取得済に登録
              </Typography>
            </Button>

            <Button
              sx={{ width: '50%', px: { mobile: 0.75, laptop: 1 } }}
              onClick={() => {
                setLocalStorageSettingModal(true);
              }}
            >
              <Typography variant="x-small">設定コードで設定を登録</Typography>
            </Button>
          </Box>

          <Box sx={{ display: { mobile: 'none', laptop: 'flex' } }}>
            <Button
              sx={{
                width: '50%',
              }}
              onClick={() => {
                setRequiredCourseEnrollmentModal(true);
              }}
            >
              <Typography variant="x-small">必修の授業を登録</Typography>
            </Button>
            <Button
              sx={{
                width: '50%',
              }}
              onClick={() => {
                setElectiveRequirementRegistrationModal(true);
              }}
            >
              <Typography variant="x-small">選択必修の授業を登録</Typography>
            </Button>

            <Button
              sx={{
                width: '50%',
              }}
              onClick={() => {
                setTagToCoursesModalOpen(true);
              }}
            >
              <Typography variant="x-small">授業にタグを登録</Typography>
            </Button>
          </Box>
        </Box>

        {/* facultyRequirementごとのの設定の表示 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
          {facultyRequirements.map((facultyRequirement) => {
            // 学部に対応する必修の授業を取得
            const targetRequiredCourses = requiredCourses.filter(
              (course) => course.faculty === facultyRequirement.facultyName
            );

            return (
              <FacultyRequirementSetting
                key={facultyRequirement.facultyName}
                facultyRequirement={facultyRequirement}
                targetRequiredCourses={targetRequiredCourses}
              />
            );
          })}
        </Box>

        {/* 単位取得済みの授業 */}
        <Box
          sx={{
            outline: '1px solid black',
            borderRadius: 1,
            p: 1,
          }}
        >
          <Typography variant="medium">取得済みの授業</Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {/* TODO: 必修・取得済みの授業・時間割に登録している授業の表示のUIをコンポーネントとして切り出して共通化する。デザインの微調整も */}
            {obrainedCourses.map((course) => (
              <Button
                key={course.course_id}
                sx={{
                  width: '50%',
                  py: { mobile: 0.5, laptop: 0.75 },
                  px: { mobile: 0.25, laptop: 1 },
                }}
                onClick={() => setCourseData(course)}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    alignItems: 'flex-start',
                  }}
                >
                  <Typography variant="xx-small" sx={{ lineHeight: 0.9 }}>
                    {course.course_id}
                  </Typography>
                  {/* なぜか文字が中央寄せになる。左よせにした方がいいのかも（要検討） */}
                  <Typography
                    variant="xx-small"
                    sx={{
                      width: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: { mobile: 1.5, laptop: 1.1 },
                    }}
                  >
                    {course.course_name}
                  </Typography>
                </Box>
              </Button>
            ))}
          </Box>
        </Box>

        {/* 時間割に登録している授業 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            outline: '1px solid black',
            borderRadius: 1,
            p: 1,
          }}
        >
          <Typography variant="medium">時間割に登録している授業</Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: 1,
            }}
          >
            {[...groupedEnrolledCoursesKeys].map((key) => (
              <Box
                key={key}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid black',
                  borderRadius: 1,
                  padding: 1,
                }}
              >
                <Typography variant="x-small">{key}年度に登録</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}
                >
                  {groupedEnrolledCourses.get(key)?.map((course) => (
                    <Button
                      key={course.course_id}
                      sx={{
                        width: '50%',
                        py: { mobile: 0.5, laptop: 0.75 },
                        px: { mobile: 0.25, laptop: 1 },
                      }}
                      onClick={() => setCourseData(course)}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          width: '100%',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Typography variant="xx-small" sx={{ lineHeight: 0.9 }}>
                          {course.course_id}
                        </Typography>
                        {/* なぜか文字が中央寄せになる。左よせにした方がいいのかも（要検討） */}
                        <Typography
                          variant="xx-small"
                          sx={{
                            width: '100%',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: { mobile: 1.5, laptop: 1.1 },
                          }}
                        >
                          {course.course_name}
                        </Typography>
                      </Box>
                    </Button>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </LargeModal>
  );
}
