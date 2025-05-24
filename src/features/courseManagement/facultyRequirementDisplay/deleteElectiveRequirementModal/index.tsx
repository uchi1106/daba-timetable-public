import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import { FC } from 'react';

import { SmallModal } from '@/components/CustomModal';
import { generateElectiveRequirementGraph } from '@/features/courseManagement/facultyRequirementDisplay/electiveRequirementDisplay/electiveRequirementGraph';
import { useFacultyRequirements } from '@/hooks/facultyRequirement';
import { ElectiveRequirement } from '@/types/facultyRequirement';

import { useDeleteElectiveRequirementModal } from './hooks';

export const DeleteElectiveRequirementModal: FC = () => {
  // electiveRequirementDataに値が入るとモーダルが開く
  const [electiveRequirementData, setElectiveRequirementData] =
    useDeleteElectiveRequirementModal();

  const { facultyRequirements, updateFacultyRequirement } =
    useFacultyRequirements();

  const targetFacultyRequirement = facultyRequirements.find(
    (facultyRequirement) =>
      facultyRequirement.electiveRequirements.some(
        (electiveRequirement) =>
          electiveRequirement.electiveRequirementId ===
          electiveRequirementData?.electiveRequirementId
      )
  );

  if (targetFacultyRequirement === undefined) {
    return <></>;
  } else {
    // TODO: graphはDisplayFacultyRequirementで生成しているので、ここで生成するのは冗長
    const graph = generateElectiveRequirementGraph(
      targetFacultyRequirement.electiveRequirements
    );

    // 下位にあるElectiveRequirementを再帰的に取得
    const generateTargetElectiveRequirements = (
      targetElectiveRequirement: ElectiveRequirement,
      targetElectiveRequirements: ElectiveRequirement[]
    ) => {
      const electiveRequirements =
        graph[targetElectiveRequirement.electiveRequirementId];

      electiveRequirements.forEach((electiveRequirement) => {
        targetElectiveRequirements.push(electiveRequirement);
        generateTargetElectiveRequirements(
          electiveRequirement,
          targetElectiveRequirements
        );
      });

      return targetElectiveRequirements;
    };

    // 削除予定のElectiveRequirementを取得
    const targetElectiveRequirements: ElectiveRequirement[] =
      electiveRequirementData
        ? generateTargetElectiveRequirements(electiveRequirementData, [
            electiveRequirementData,
          ])
        : [];

    const deleteElectiveRequirements = () => {
      const targetElectiveRequirementIds = targetElectiveRequirements.map(
        (electiveRequirement) => electiveRequirement.electiveRequirementId
      );

      const newElectiveRequirements =
        targetFacultyRequirement.electiveRequirements.filter(
          (electiveRequirement) =>
            !targetElectiveRequirementIds.includes(
              electiveRequirement.electiveRequirementId
            )
        );

      updateFacultyRequirement({
        ...targetFacultyRequirement,
        electiveRequirements: newElectiveRequirements,
      });

      // モーダルを閉じる
      setElectiveRequirementData(null);
    };

    return electiveRequirementData ? (
      <SmallModal
        open={!!electiveRequirementData}
        onClose={() => setElectiveRequirementData(null)}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: 2,
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Typography>
            選択された設定の下位にあるものを含めて以下の選択必修を削除します。
          </Typography>
          <Box>
            {targetElectiveRequirements.map((electiveRequirement) => (
              <Box
                key={electiveRequirement.electiveRequirementId}
                sx={{ display: 'flex', flexDirection: 'column', rowGap: 1 }}
              >
                <Typography>
                  {electiveRequirement.electiveRequirementId}
                </Typography>
              </Box>
            ))}
          </Box>

          <ButtonGroup sx={{ display: 'flex', width: '100%' }}>
            <Button
              onClick={() => {
                setElectiveRequirementData(null);
              }}
              sx={{ width: '50%' }}
            >
              キャンセル
            </Button>

            <Button
              onClick={() => {
                deleteElectiveRequirements();
              }}
              sx={{ width: '50%' }}
            >
              確定
            </Button>
          </ButtonGroup>
        </Box>
      </SmallModal>
    ) : (
      <></>
    );
  }
};
