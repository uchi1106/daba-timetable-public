import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Chip,
  Collapse,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FC, memo, useState } from 'react';

import { ElectiveRequirementGraph } from '@/features/courseManagement/facultyRequirementDisplay/electiveRequirementDisplay/electiveRequirementGraph';
import { Course } from '@/types/course';
import { ElectiveRequirement } from '@/types/facultyRequirement';

import CourseItem from '../../../common/CourseItem';
import { useElectiveRequirementMenuPopup } from '../electiveRequirementMenuPopup/hooks';
import { AllocateCoursesInfo } from './allocateCoursesToRequirements';

interface ElectiveRequirementDisplayProps {
  electiveRequirement: ElectiveRequirement;
  graph: ElectiveRequirementGraph;
  allocateCoursesInfo: AllocateCoursesInfo;
}

const ElectiveRequirementDisplay: FC<ElectiveRequirementDisplayProps> = ({
  electiveRequirement,
  graph,
  allocateCoursesInfo,
}) => {
  const [, setAnchorEl] = useElectiveRequirementMenuPopup();

  const theme = useTheme();
  const isLapTop = useMediaQuery(theme.breakpoints.up('laptop'));

  // 表示する授業を取得
  const displayCourses = allocateCoursesInfo[
    electiveRequirement?.electiveRequirementId
  ]
    ? [
        ...allocateCoursesInfo[electiveRequirement?.electiveRequirementId]
          .displayedCourses,
      ].sort((a, b) => {
        // ソート優先度を数値で定義（小さいほど優先）
        const getPriority = (course: Course) => {
          if (course.required && !course.obtained) return 0; // 1番目
          if (course.required && course.obtained) return 1; // 2番目
          if (!course.required && course.obtained) return 2; // 3番目
          return 3; // その他（例えば必修でなく未取得の場合など）
        };
        return getPriority(a) - getPriority(b);
      })
    : [];

  const [expanded, setExpanded] = useState(
    allocateCoursesInfo[electiveRequirement.electiveRequirementId]
      .obtainedCredits < electiveRequirement.credits
  );

  // 展開ボタンのクリックイベント
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Box sx={{ outline: '1px solid black', borderRadius: 1, mt: 1 }}>
      <Box
        sx={{
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'grey.200',
          pl: 0.5,
          py: { mobile: 0.5, laptop: 1 },
          columnGap: 0.5,
        }}
      >
        <IconButton
          sx={{ p: 0.5 }}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          {expanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
        </IconButton>

        <Box sx={{ width: '100%' }}>
          <Typography variant="medium">
            {electiveRequirement?.electiveRequirementId}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                rowGap: 0.5,
                columnGap: 1,
                flexWrap: 'wrap',
                width: '100%',
                mr: 0.5,
              }}
            >
              {electiveRequirement?.tags.length > 0 &&
                electiveRequirement?.tags.map((tag) => (
                  <Chip
                    sx={{ padding: 0, height: { mobile: 16, laptop: 24 } }}
                    key={tag}
                    label={
                      <Typography sx={{ fontSize: { mobile: 8, laptop: 14 } }}>
                        {tag}
                      </Typography>
                    }
                  />
                ))}
              {electiveRequirement?.tags.length === 0 && (
                <Typography variant="x-small">
                  他の選択必修で余った授業から
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                columnGap: 0.5,
                ml: 'auto',
                mr: 1,
              }}
            >
              <Typography variant="large" sx={{ whiteSpace: 'nowrap' }}>
                {allocateCoursesInfo[electiveRequirement?.electiveRequirementId]
                  .obtainedCredits !== undefined
                  ? allocateCoursesInfo[
                      electiveRequirement?.electiveRequirementId
                    ].obtainedCredits
                  : 0}
                {' / '}
                {electiveRequirement?.credits}
              </Typography>

              <Typography variant="medium" sx={{ whiteSpace: 'nowrap' }}>
                単位
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* パソコンでのみ選択必修の編集を許可したいので、パソコンのときのみ表示 */}
        {isLapTop && (
          <IconButton
            id={electiveRequirement?.electiveRequirementId}
            sx={{
              ml: 'auto',
            }}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
            }}
          >
            <MoreVertIcon />
          </IconButton>
        )}
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {displayCourses.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: 1,
              m: 1,
            }}
          >
            {displayCourses.map((course) => (
              // idはCourseItem内のuseDraggableに一意なキーを設定するのに使用される
              <CourseItem
                key={course.course_id}
                id={
                  electiveRequirement.electiveRequirementId + course.course_id
                }
                course={course}
              />
            ))}
          </Box>
        )}

        <Box
          sx={{
            ml: { mobile: 1, laptop: 3 },
            display: 'flex',
            flexDirection: 'column',
            rowGap: 1,
          }}
        >
          {graph[electiveRequirement.electiveRequirementId].map(
            (nextElectiveRequirement) => (
              <ElectiveRequirementDisplay
                key={nextElectiveRequirement?.electiveRequirementId}
                electiveRequirement={nextElectiveRequirement}
                graph={graph}
                allocateCoursesInfo={allocateCoursesInfo}
              />
            )
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default memo(ElectiveRequirementDisplay, (prevProps, nextProps) => {
  return (
    prevProps.electiveRequirement === nextProps.electiveRequirement &&
    prevProps.allocateCoursesInfo === nextProps.allocateCoursesInfo
  );
});
