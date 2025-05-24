import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Button,
  ButtonGroup,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { LargeModal } from '@/components/CustomModal';
import { useTags } from '@/hooks/course';
import { useFacultyRequirements } from '@/hooks/facultyRequirement';
import { ElectiveRequirement } from '@/types/facultyRequirement';

import { useEditElectiveRequirementModal } from './hooks';

// TODO: addElectiveRequirementModalとEditElectiveRequirementModalの共通化
export default function EditElectiveRequirementModal() {
  // electiveRequirementDataに値が入るとモーダルが開く
  const [electiveRequirementData, setElectiveRequirementData] =
    useEditElectiveRequirementModal();

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

  const { tags } = useTags();

  const [targetElectiveRequirement, setTargetElectiveRequirement] =
    useState<ElectiveRequirement>({
      electiveRequirementId: '',
      tags: [],
      upperElectiveRequirementId: '',
      credits: 0,
    });

  useEffect(() => {
    setTargetElectiveRequirement(
      electiveRequirementData ?? {
        electiveRequirementId: '',
        tags: [],
        upperElectiveRequirementId: '',
        credits: 0,
      }
    );
  }, [electiveRequirementData]);

  if (targetFacultyRequirement) {
    const handleEditFinish = () => {
      const updatedElectiveRequirements =
        targetFacultyRequirement.electiveRequirements.map(
          (electiveRequirement) => {
            // ここでtargetFacultyRequirementを使うとtargetFacultyRequirement.idを編集したときに変更が反映されなくなる。
            if (
              electiveRequirement.electiveRequirementId ===
              electiveRequirementData?.electiveRequirementId
            ) {
              return targetElectiveRequirement;
              // electiveRequirementIdを編集した場合、他のelectiveRequirementのupperElectiveRequirementIdも直す
            } else if (
              electiveRequirement.upperElectiveRequirementId ===
              electiveRequirementData?.electiveRequirementId
            ) {
              return {
                ...electiveRequirement,
                upperElectiveRequirementId:
                  targetElectiveRequirement.electiveRequirementId,
              };
            }
            return electiveRequirement;
          }
        );

      updateFacultyRequirement({
        ...targetFacultyRequirement,
        electiveRequirements: updatedElectiveRequirements,
      });

      setElectiveRequirementData(null);
    };

    return (
      electiveRequirementData && (
        <LargeModal
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
              以下の項目を入力し、「保存」をクリックすると選択必修の編集が完了します
            </Typography>
            {/* TODO: 必須入力のバリデーションをかける */}
            {/* TODO: 既に設定されている選択必修と同じものは登録できないようにする */}
            <TextField
              sx={{ width: '50%' }}
              value={targetElectiveRequirement.electiveRequirementId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTargetElectiveRequirement((prev) => ({
                  ...prev,
                  electiveRequirementId: e.target.value,
                }));
              }}
              label="選択必修の名前を入力して下さい"
            />

            <Autocomplete
              multiple
              options={tags}
              value={targetElectiveRequirement.tags}
              onChange={(
                _e: React.SyntheticEvent<Element, Event>,
                newValues: string[]
              ) =>
                setTargetElectiveRequirement((prev) => ({
                  ...prev,
                  electiveRequirementId:
                    prev.electiveRequirementId === ''
                      ? newValues.join('')
                      : prev.electiveRequirementId,
                  tags: newValues,
                }))
              }
              renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField
                  {...params}
                  label="選択必修にするタグを選択してください"
                />
              )}
            />

            <Autocomplete
              options={
                targetFacultyRequirement.electiveRequirements.map(
                  (electiveRequirement: ElectiveRequirement) =>
                    electiveRequirement.electiveRequirementId
                ) || []
              }
              value={targetElectiveRequirement.upperElectiveRequirementId}
              onChange={(
                _e: React.SyntheticEvent<Element, Event>,
                newValue: string | null
              ) => {
                setTargetElectiveRequirement((prev) => ({
                  ...prev,
                  upperElectiveRequirementId: newValue || '',
                }));
              }}
              renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField
                  {...params}
                  label="上位の選択必修設定を選択してください（任意）"
                />
              )}
            />

            <TextField
              sx={{ width: 120 }}
              type="number"
              value={targetElectiveRequirement.credits ?? 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTargetElectiveRequirement({
                  ...targetElectiveRequirement,
                  credits: Math.max(0, parseInt(e.target.value, 10)),
                })
              }
              placeholder="必要単位数"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">単位</InputAdornment>
                  ),
                },
              }}
            />

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
                  handleEditFinish();
                }}
                sx={{ width: '50%' }}
              >
                保存
              </Button>
            </ButtonGroup>
          </Box>
        </LargeModal>
      )
    );
  }
}
