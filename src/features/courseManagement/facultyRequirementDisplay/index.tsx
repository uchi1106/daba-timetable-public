import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  IconButton,
  Input,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { memo, useMemo, useState } from 'react';

import {
  ElectiveRequirementGraph,
  generateElectiveRequirementGraph,
} from '@/features/courseManagement/facultyRequirementDisplay/electiveRequirementDisplay/electiveRequirementGraph';
import { useFacultyRequirements } from '@/hooks/facultyRequirement';
import { Course } from '@/types/course';
import { FacultyRequirement } from '@/types/facultyRequirement';

import ElectiveRequirementDisplay from './electiveRequirementDisplay';
import {
  AllocateCoursesInfo,
  allocateCoursesToRequirements,
} from './electiveRequirementDisplay/allocateCoursesToRequirements';

interface FacultyRequirementDisplayProps {
  facultyRequirement: FacultyRequirement;
  courses: Course[];
}
const FacultyRequirementDisplay: React.FC<FacultyRequirementDisplayProps> = ({
  facultyRequirement,
  courses,
}) => {
  const { updateFacultyRequirement } = useFacultyRequirements();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const theme = useTheme();
  const isLapTop = useMediaQuery(theme.breakpoints.up('laptop'));

  const [targetFacultyRequirementId, setTargetFacultyRequirementId] = useState<
    string | null
  >(facultyRequirement.facultyRequirementId);

  const [targetFacultyRequirementCredits, setTargetFacultyRequirementCredits] =
    useState<number | null>(facultyRequirement.credits);

  // 取得済みの授業の単位数の合計を計算
  const obtainedFacultyRequirementCredits = courses
    .filter((course) => course.obtained === true)
    .reduce((acc, course) => acc + course.credits, 0);

  const handleEditFinish = () => {
    updateFacultyRequirement({
      ...facultyRequirement,
      facultyRequirementId: targetFacultyRequirementId ?? '',
      credits: targetFacultyRequirementCredits ?? 0,
    });

    setIsEditing(false);
  };

  const graph: ElectiveRequirementGraph = useMemo(
    () =>
      generateElectiveRequirementGraph(facultyRequirement.electiveRequirements),
    [facultyRequirement.electiveRequirements]
  );

  // 科目要件に授業を割り当てる
  const allocateCoursesInfo: AllocateCoursesInfo = useMemo(
    () =>
      allocateCoursesToRequirements(
        facultyRequirement.electiveRequirements,
        courses,
        graph
      ),
    [facultyRequirement.electiveRequirements, courses, graph]
  );

  // 上位要件のみを取得
  const topElectiveRequirements =
    facultyRequirement.electiveRequirements.filter(
      (electiveRequirement) =>
        electiveRequirement.upperElectiveRequirementId === null
    );

  return (
    <Box sx={{ mt: { mobile: 0, laptop: 2 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {!isEditing ? (
          // 閲覧中
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Box
              sx={{
                width: '100%',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 1,
              }}
            >
              <Typography variant="medium">
                {targetFacultyRequirementId}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                columnGap: 1,
                ml: 1,
                mr: 1,
              }}
            >
              <Typography variant="medium">
                {obtainedFacultyRequirementCredits}
              </Typography>
              <Typography variant="medium">/</Typography>
              <Typography variant="medium">
                {targetFacultyRequirementCredits}
              </Typography>
              <Typography variant="medium" noWrap>
                単位
              </Typography>
            </Box>

            {/* パソコンでのみ選択必修の編集を許可したいので、パソコンのときのみ表示 */}
            {isLapTop && (
              <Button
                sx={{
                  ml: 1,
                  mr: 1,
                  borderRadius: '50%',
                  p: 1,
                  minWidth: 24,
                  width: 30,
                  height: 30,
                }}
                onClick={() => setIsEditing(true)}
              >
                <EditIcon sx={{ height: 24, width: 24 }} />
              </Button>
            )}
          </Box>
        ) : (
          // 編集中
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <TextField
              sx={{ width: 400 }}
              value={targetFacultyRequirementId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTargetFacultyRequirementId(e.target.value);
              }}
              variant="outlined"
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                columnGap: 1.5,
                ml: 2,
              }}
            >
              <Typography sx={{ fontSize: '1.6rem' }}>
                {obtainedFacultyRequirementCredits}
              </Typography>
              <Typography sx={{ fontSize: '1.7rem' }}>/</Typography>
              <Input
                sx={{
                  width: 60,
                }}
                type="number"
                value={targetFacultyRequirementCredits ?? 0}
                onChange={(e) => {
                  setTargetFacultyRequirementCredits(
                    Math.max(0, parseInt(e.target.value, 10))
                  );
                }}
              />
            </Box>

            <IconButton
              sx={{
                ml: 2,
                mr: 'auto',
              }}
              onClick={() => {
                handleEditFinish();
              }}
            >
              <CheckIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1 }}>
        {topElectiveRequirements.map((electiveRequirement) => (
          <ElectiveRequirementDisplay
            key={electiveRequirement.electiveRequirementId}
            electiveRequirement={electiveRequirement}
            graph={graph}
            allocateCoursesInfo={allocateCoursesInfo}
          />
        ))}
      </Box>
    </Box>
  );
};

export default memo(FacultyRequirementDisplay);
