import { Menu, MenuItem } from '@mui/material';

import { useDeleteElectiveRequirementModal } from '@/features/courseManagement/facultyRequirementDisplay/deleteElectiveRequirementModal/hooks';
import { useEditElectiveRequirementModal } from '@/features/courseManagement/facultyRequirementDisplay/editElectiveRequirementModal/hooks';
import { useFacultyRequirements } from '@/hooks/facultyRequirement';
import {
  ElectiveRequirement,
  FacultyRequirement,
} from '@/types/facultyRequirement';

import { generateElectiveRequirementGraph } from '../electiveRequirementDisplay/electiveRequirementGraph';
import { useElectiveRequirementMenuPopup } from '../electiveRequirementMenuPopup/hooks';

export const ElectiveRequirementMenuPopup: React.FC = () => {
  const finedElectiveRequirementIndex = (
    electiveRequirementId: string
  ): number =>
    targetFacultyRequirement?.electiveRequirements.findIndex(
      (electiveRequirement) =>
        electiveRequirement.electiveRequirementId === electiveRequirementId
    ) ?? -1;

  const swapElectiveRequirement = (
    electiveRequirementIndex_A: number,
    electiveRequirementIndex_B: number
  ) => {
    if (targetFacultyRequirement === null) {
      return;
    }

    const newElectiveRequirements = [
      ...targetFacultyRequirement.electiveRequirements,
    ];
    [
      newElectiveRequirements[electiveRequirementIndex_A],
      newElectiveRequirements[electiveRequirementIndex_B],
    ] = [
      newElectiveRequirements[electiveRequirementIndex_B],
      newElectiveRequirements[electiveRequirementIndex_A],
    ];

    updateFacultyRequirement({
      ...targetFacultyRequirement,
      electiveRequirements: newElectiveRequirements,
    });
  };

  const { facultyRequirements, updateFacultyRequirement } =
    useFacultyRequirements();

  const [anchorEl, setAnchorEl] = useElectiveRequirementMenuPopup();

  let targetFacultyRequirement: FacultyRequirement | null = null;
  let targetElectiveRequirement: ElectiveRequirement | null = null;

  const targetElectiveRequirementId: string = anchorEl?.id ?? '';

  for (let i = 0; i < facultyRequirements.length; i++) {
    const facultyRequirement = facultyRequirements[i];
    const foundElectiveRequirement =
      facultyRequirement.electiveRequirements.find(
        (electiveRequirement) =>
          electiveRequirement.electiveRequirementId ===
          targetElectiveRequirementId
      );

    if (foundElectiveRequirement) {
      targetElectiveRequirement = foundElectiveRequirement;
      targetFacultyRequirement = facultyRequirement;
      break;
    }
  }

  const graph = generateElectiveRequirementGraph(
    targetFacultyRequirement?.electiveRequirements ?? []
  );

  const targetElectiveRequirementIndex = finedElectiveRequirementIndex(
    targetElectiveRequirementId
  );

  let upElectiveRequirement: ElectiveRequirement | null = null;
  let downElectiveRequirement: ElectiveRequirement | null = null;

  if (targetElectiveRequirement?.upperElectiveRequirementId) {
    const baseElectiveRequirementIndex = graph[
      targetElectiveRequirement.upperElectiveRequirementId
    ].findIndex(
      (electiveRequirement) =>
        electiveRequirement.electiveRequirementId ===
        targetElectiveRequirementId
    );

    upElectiveRequirement =
      graph[targetElectiveRequirement?.upperElectiveRequirementId][
        baseElectiveRequirementIndex - 1
      ];

    // (baseElectiveRequirementIndex + 1 < 0 )?
    downElectiveRequirement =
      graph[targetElectiveRequirement?.upperElectiveRequirementId][
        baseElectiveRequirementIndex + 1
      ];
  } else {
    // 上位要件のみを取得
    const topElectiveRequirements =
      targetFacultyRequirement?.electiveRequirements.filter(
        (electiveRequirement) =>
          electiveRequirement.upperElectiveRequirementId === null
      );

    const baseElectiveRequirementIndex =
      topElectiveRequirements?.findIndex(
        (elsectiveRequirement) =>
          elsectiveRequirement.electiveRequirementId ===
          targetElectiveRequirementId
      ) ?? -1;

    if (baseElectiveRequirementIndex - 1 >= 0) {
      upElectiveRequirement =
        topElectiveRequirements?.[baseElectiveRequirementIndex - 1] ?? null;
    }

    if (
      topElectiveRequirements &&
      baseElectiveRequirementIndex + 1 < topElectiveRequirements.length
    ) {
      downElectiveRequirement =
        topElectiveRequirements?.[baseElectiveRequirementIndex + 1] ?? null;
    }
  }
  const upElectiveRequirementIndex = finedElectiveRequirementIndex(
    upElectiveRequirement?.electiveRequirementId ?? ''
  );

  const downElectiveRequirementIndex = finedElectiveRequirementIndex(
    downElectiveRequirement?.electiveRequirementId ?? ''
  );

  // 編集モーダルを開く
  const [, setEditElectiveRequirement] = useEditElectiveRequirementModal();

  // 削除モーダルを開く
  const [, setDeleteElectiveRequirement] = useDeleteElectiveRequirementModal();

  return (
    <Menu
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      keepMounted
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          swapElectiveRequirement(
            targetElectiveRequirementIndex,
            upElectiveRequirementIndex
          );
        }}
        disabled={!!(upElectiveRequirementIndex === -1)}
      >
        上に移動
      </MenuItem>

      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          swapElectiveRequirement(
            targetElectiveRequirementIndex,
            downElectiveRequirementIndex
          );
        }}
        disabled={!(downElectiveRequirementIndex !== -1)}
      >
        下に移動
      </MenuItem>

      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          if (targetElectiveRequirement) {
            setEditElectiveRequirement(targetElectiveRequirement);
          }
        }}
      >
        編集
      </MenuItem>
      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          if (targetElectiveRequirement) {
            setDeleteElectiveRequirement(targetElectiveRequirement);
          }
        }}
      >
        削除
      </MenuItem>
    </Menu>
  );
};
