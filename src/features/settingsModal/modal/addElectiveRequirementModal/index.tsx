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
import { useState } from 'react';

import { LargeModal } from '@/components/CustomModal';
import { useTags } from '@/hooks/course';
import { useFacultyRequirements } from '@/hooks/facultyRequirement';
import {
  ElectiveRequirement,
  FacultyRequirement,
} from '@/types/facultyRequirement';

import { useAddElectiveRequirementModal } from './hook';

export default function ElectiveRequirementRegistrationModal() {
  const [isOpen, setIsOpen] = useAddElectiveRequirementModal();

  const { facultyRequirements, updateFacultyRequirement } =
    useFacultyRequirements();

  const [targetFacultyRequirement, setTargetFacultyRequirement] =
    useState<FacultyRequirement>({
      facultyRequirementId: '',
      facultyName: '',
      credits: 0,
      requiredCourseNames: [],
      electiveRequirements: [],
    });

  const [targetElectiveRequirement, setTargetElectiveRequirement] =
    useState<ElectiveRequirement>({
      electiveRequirementId: '',
      tags: [],
      upperElectiveRequirementId: null,
      credits: 0,
    });

  const { tags } = useTags();

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
        <Typography>
          以下の項目を入力し、「登録」をクリックすると選択必修が登録できます。
        </Typography>
        {/* TODO: 必須入力のバリデーションをかける */}
        {/* TODO: 選択必修に含めない授業を登録できるようにする */}
        {/* TODO: 既に設定されている選択必修と同じものは登録できないようにする */}

        <Autocomplete<FacultyRequirement, false, false, false>
          options={facultyRequirements}
          getOptionLabel={(facultyRequirement) =>
            facultyRequirement.facultyName || ''
          }
          value={targetFacultyRequirement}
          onChange={(_event, newValue) => {
            if (newValue) {
              setTargetFacultyRequirement(newValue);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="選択必修を設定する学部を選択してください（必須）"
            />
          )}
          isOptionEqualToValue={(option, value) =>
            option.facultyRequirementId === value.facultyRequirementId
          }
        />

        <TextField
          sx={{ width: '50%' }}
          value={targetElectiveRequirement.electiveRequirementId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setTargetElectiveRequirement((prev) => ({
              ...prev,
              electiveRequirementId: e.target.value,
            }));
          }}
          label="選択必修の名前を入力して下さい(必須)"
        />

        <Autocomplete
          multiple
          options={tags}
          value={targetElectiveRequirement.tags}
          onChange={(
            _e: React.SyntheticEvent<Element, Event>,
            newValues: string[]
          ) => {
            return setTargetElectiveRequirement((prev) => {
              return {
                ...prev,
                electiveRequirementId:
                  prev.electiveRequirementId !== ''
                    ? prev.electiveRequirementId
                    : newValues.join('と'),
                tags: newValues,
              };
            });
          }}
          renderInput={(params: AutocompleteRenderInputParams) => (
            <TextField
              {...params}
              label="選択必修にするタグを選択してください"
            />
          )}
        />

        <Autocomplete
          options={
            targetFacultyRequirement?.electiveRequirements.map(
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
              setIsOpen(false);
            }}
            sx={{ width: '50%' }}
          >
            <Typography variant="xx-small">キャンセル</Typography>
          </Button>

          <Button
            onClick={() => {
              updateFacultyRequirement({
                ...targetFacultyRequirement,
                electiveRequirements: [
                  ...targetFacultyRequirement.electiveRequirements,
                  targetElectiveRequirement,
                ],
              });
              setIsOpen(false);

              // 入力ボックスを初期化
              setTargetFacultyRequirement({
                facultyRequirementId: '',
                facultyName: '',
                credits: 0,
                electiveRequirements: [],
                requiredCourseNames: [],
              });
              setTargetElectiveRequirement({
                electiveRequirementId: '',
                tags: [],
                upperElectiveRequirementId: null,
                credits: 0,
              });
            }}
            sx={{ width: '50%' }}
          >
            <Typography variant="xx-small">登録</Typography>
          </Button>
        </ButtonGroup>
      </Box>
    </LargeModal>
  );
}
