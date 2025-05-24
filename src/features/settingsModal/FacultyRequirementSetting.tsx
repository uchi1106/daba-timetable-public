import { Box, Button, Chip, Typography } from '@mui/material';

import { Course } from '@/types/course';
import { FacultyRequirement } from '@/types/facultyRequirement';

import { useCourseDetailModal } from '../common/courseDetailModal/hook';

export const FacultyRequirementSetting = ({
  facultyRequirement,
  targetRequiredCourses,
}: {
  facultyRequirement: FacultyRequirement;
  targetRequiredCourses: Course[];
}) => {
  const [, setCourseData] = useCourseDetailModal();

  return (
    <Box
      key={facultyRequirement.facultyRequirementId}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: { mobile: 1, laptop: 2 },
        outline: '1px solid black',
        borderRadius: 1,
        pt: { mobile: 1, laptop: 2 },
        pl: { mobile: 1, laptop: 2 },
      }}
    >
      {/* 学部名・単位 */}
      <Box sx={{ display: 'flex', columnGap: 3 }}>
        <Typography variant="medium">
          {facultyRequirement.facultyName}
        </Typography>
        <Typography variant="medium">
          {facultyRequirement.credits}単位
        </Typography>
      </Box>

      <Box
        sx={{
          outline: '1px solid black',
          borderRadius: 1,
          py: { mobile: 1, laptop: 2 },
          pl: { mobile: 1, laptop: 2 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="medium">必修</Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {targetRequiredCourses.map((course) => (
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

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: { mobile: 0.5, laptop: 2 },
          outline: '1px solid black',
          borderRadius: 1,
          pt: { mobile: 1, laptop: 2 },
          pl: { mobile: 1, laptop: 2 },
        }}
      >
        <Typography variant="medium">選択必修</Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: { mobile: 0.5, laptop: 1 },
          }}
        >
          {facultyRequirement.electiveRequirements.map(
            (electiveRequirement) => (
              <Box
                key={electiveRequirement.electiveRequirementId}
                sx={{
                  outline: '1px solid black',
                  borderRadius: 1,
                  p: { mobile: 0.5, laptop: 1 },
                }}
              >
                <Typography variant="medium">
                  {electiveRequirement.electiveRequirementId}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {electiveRequirement.tags.length > 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        rowGap: 0.5,
                        columnGap: 1,
                        flexWrap: 'wrap',
                      }}
                    >
                      {electiveRequirement.tags.map((tag) => (
                        <Chip
                          sx={{
                            padding: 0,
                            height: { mobile: 16, laptop: 24 },
                          }}
                          key={tag}
                          label={
                            <Typography
                              sx={{ fontSize: { mobile: 8, laptop: 14 } }}
                            >
                              {tag}
                            </Typography>
                          }
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="x-small">
                      他で余った全ての授業から
                    </Typography>
                  )}

                  <Typography
                    variant="small"
                    sx={{
                      ml: 'auto',
                      mr: { mobile: 0.5, laptop: 2 },
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {electiveRequirement.credits}単位
                  </Typography>
                </Box>

                {/* TODO: 上の要素からなぜか間隔が開いている（特にスマホで顕著）。もう少し狭くする  */}
                <Typography variant="x-small">
                  上位の選択必修：
                  {electiveRequirement.upperElectiveRequirementId
                    ? electiveRequirement.upperElectiveRequirementId
                    : 'なし'}
                </Typography>
              </Box>
            )
          )}
        </Box>
      </Box>
    </Box>
  );
};
