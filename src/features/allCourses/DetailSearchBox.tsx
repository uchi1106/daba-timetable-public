import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { memo, useCallback } from 'react';

import { useTags } from '@/hooks/course';
import { useFacultyRequirements } from '@/hooks/facultyRequirement';
import { filterDayAtom, filterPeriodAtom } from '@/hooks/filterSchedule';
import { targetEnrolledTermAtom } from '@/hooks/term';

import { FilterState, FilterValue } from './CourseSearchBar';

interface DetailSearchBoxProps {
  handleFilterChange: <K extends keyof FilterState>(
    key: K,
    value: FilterValue<K>
  ) => void;
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  setIsDetailSearchBoxOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const DetailSearchBox: React.FC<DetailSearchBoxProps> = ({
  handleFilterChange,
  filter,
  setFilter,
  setIsDetailSearchBoxOpened,
}) => {
  const isLapTop = useMediaQuery((theme) => theme.breakpoints.up('laptop'));

  const { tags } = useTags();
  const targetTerm: string = useAtomValue(targetEnrolledTermAtom);
  const { facultyRequirements } = useFacultyRequirements();
  const facultyNames = facultyRequirements.map(
    (facultyRequirement) => facultyRequirement.facultyName
  );

  const [filterDay, setFilterDay] = useAtom(filterDayAtom);
  const [filterPeriod, setFilterPeriod] = useAtom(filterPeriodAtom);

  const handleGradeChange = useCallback(
    (grade: number) => {
      handleFilterChange(
        'targetRequiredGrades',
        filter.targetRequiredGrades.includes(grade)
          ? filter.targetRequiredGrades.filter((g) => g !== grade)
          : [...filter.targetRequiredGrades, grade].sort()
      );
    },
    [filter.targetRequiredGrades, handleFilterChange]
  );

  const clearFilter = () => {
    setFilter(() => {
      return {
        targetName: '',
        targetFaculty: '',
        targetInstructor: '',
        targetTerm: targetTerm,
        targetTags: [],
        targetRequiredGrades: [],
        isRequired: false,
        isNotRequired: false,
        isObtained: false,
        isNotObtained: false,
      };
    });
    setFilterDay([]);
    setFilterPeriod([]);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        zIndex: 2,
        position: { mobile: 'fixed', laptop: 'absolute' },
        width: { mobile: 'calc(100% - 16px)', laptop: '90%' },
        right: { mobile: 0, laptop: 'none' },
        left: { mobile: 0, laptop: 'none' },
        ml: { mobile: 1, laptop: 0 },
        background: 'white',
        border: 1,
        borderRadius: 3.34,
        boxShadow: 10,
        mt: 1,
        p: 2,
        rowGap: 1.5,
      }}
    >
      <Autocomplete
        multiple
        options={tags}
        value={filter.targetTags}
        onChange={(_, newValue) => handleFilterChange('targetTags', newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="タグで絞り込み"
            size={isLapTop ? 'medium' : 'small'}
          />
        )}
        renderOption={(props, option) => {
          const { key, ...rest } = props;
          return (
            <Typography
              key={key}
              {...rest}
              style={{
                fontSize: isLapTop ? '16px' : '10px',
                padding: 10,
                height: 'min-content',
                minHeight: 0,
              }}
            >
              {option}
            </Typography>
          );
        }}
        size={isLapTop ? 'medium' : 'small'}
        sx={{
          '& .MuiInputLabel-root': {
            fontSize: isLapTop ? '16px' : '10px',
          },
          '& .MuiAutocomplete-inputRoot': {
            fontSize: isLapTop ? '16px' : '10px',
            minHeight: isLapTop ? '40px' : '32px',
          },
          '& .MuiChip-root': {
            fontSize: isLapTop ? '12px' : '6px',
            height: 'fit-content',
            minHeight: 0,
          },
          '& .MuiAutocomplete-listbox li': {
            fontSize: isLapTop ? '16px' : '10px',
            padding: 0,
            height: 'min-content',
            minHeight: 0,
          },
        }}
      />

      <Box>
        {/* 対象学年 */}
        <FormGroup>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              height: 'min-content',
            }}
          >
            {[1, 2, 3, 4].map((grade) => (
              <FormControlLabel
                key={grade}
                control={
                  <Checkbox
                    checked={filter.targetRequiredGrades.includes(grade)}
                    onChange={() => handleGradeChange(grade)}
                    size={isLapTop ? 'medium' : 'small'}
                  />
                }
                label={`${grade}年次～`}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: isLapTop ? '16px' : '10px',
                  },
                }}
              />
            ))}
          </Box>
        </FormGroup>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={filter.isRequired}
                onChange={(e) =>
                  handleFilterChange('isRequired', e.target.checked)
                }
                size={isLapTop ? 'medium' : 'small'}
              />
            }
            label="必修"
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: isLapTop ? '16px' : '10px',
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filter.isNotRequired}
                onChange={(e) =>
                  handleFilterChange('isNotRequired', e.target.checked)
                }
                size={isLapTop ? 'medium' : 'small'}
              />
            }
            label="必修でない"
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: isLapTop ? '16px' : '10px',
              },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={filter.isObtained}
                onChange={(e) =>
                  handleFilterChange('isObtained', e.target.checked)
                }
                size={isLapTop ? 'medium' : 'small'}
              />
            }
            label="取得済"
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: isLapTop ? '16px' : '10px',
              },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={filter.isNotObtained}
                onChange={(e) =>
                  handleFilterChange('isNotObtained', e.target.checked)
                }
                size={isLapTop ? 'medium' : 'small'}
              />
            }
            label="未取得"
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: isLapTop ? '16px' : '10px',
              },
            }}
          />
        </Box>
      </Box>

      {/* 学部、教師名 */}
      <Box sx={{ display: 'flex', width: '100%', columnGap: 1 }}>
        <FormControl sx={{ width: '30%' }} size={isLapTop ? 'medium' : 'small'}>
          <InputLabel
            sx={{
              fontSize: isLapTop ? '16px' : '10px',
            }}
          >
            学部
          </InputLabel>
          <Select
            value={filter.targetFaculty}
            label="学部"
            onChange={(e: SelectChangeEvent<string>) => {
              handleFilterChange('targetFaculty', e.target.value);
            }}
            size={isLapTop ? 'medium' : 'small'}
            sx={{
              fontSize: isLapTop ? '16px' : '10px',
            }}
            renderValue={(selected) => selected || '未選択'}
          >
            {facultyNames.map((faculty) => (
              <MenuItem
                key={faculty}
                value={faculty}
                sx={{
                  minHeight: 0,
                  fontSize: isLapTop ? '16px' : '10px',
                  '&.MuiMenuItem-gutters': {
                    paddingY: 1,
                  },
                }}
                onClick={() => {
                  if (filter.targetFaculty === faculty) {
                    // すでに選択されている場合は選択解除
                    handleFilterChange('targetFaculty', '');
                  } else {
                    // 通常の選択
                    handleFilterChange('targetFaculty', faculty);
                  }
                }}
              >
                {faculty}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: '70%' }} size={isLapTop ? 'medium' : 'small'}>
          <TextField
            value={filter.targetInstructor}
            onChange={(e) =>
              handleFilterChange('targetInstructor', e.target.value)
            }
            placeholder="教師名"
            size={isLapTop ? 'medium' : 'small'}
            sx={{
              input: {
                fontSize: isLapTop ? '16px' : '10px',
                '&::placeholder': {
                  fontSize: isLapTop ? '16px' : '10px',
                },
              },
            }}
          />
        </FormControl>
      </Box>

      {/* 曜日、コマ */}
      <Box sx={{ display: 'flex', columnGap: 1 }}>
        <FormControl sx={{ width: '70%' }} size={isLapTop ? 'medium' : 'small'}>
          <InputLabel
            sx={{
              fontSize: isLapTop ? '16px' : '10px',
            }}
          >
            曜日
          </InputLabel>
          <Select<string[]>
            multiple
            value={filterDay.map((day) => `${day}曜日`)}
            label="曜日"
            onChange={(e: SelectChangeEvent<string[]>) => {
              const value =
                typeof e.target.value === 'string'
                  ? e.target.value.split(',')
                  : e.target.value;
              // 曜日の末尾の「曜日」を削除
              const shortDays = value.map((day) => day.replace('曜日', ''));
              setFilterDay(shortDays);
            }}
            size={isLapTop ? 'medium' : 'small'}
            sx={{
              fontSize: isLapTop ? '16px' : '10px',
            }}
          >
            {['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'].map(
              (day) => (
                <MenuItem
                  key={day}
                  value={day}
                  sx={{
                    minHeight: 0,
                    fontSize: isLapTop ? '16px' : '10px',
                    '&.MuiMenuItem-gutters': {
                      paddingY: 1,
                    },
                  }}
                >
                  <Typography variant="small">{day}</Typography>
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>

        <FormControl sx={{ width: '30%' }} size={isLapTop ? 'medium' : 'small'}>
          <InputLabel sx={{ fontSize: isLapTop ? '16px' : '10px' }}>
            コマ
          </InputLabel>
          <Select
            multiple
            value={filterPeriod} // 数値配列のまま
            label="Period"
            sx={{
              fontSize: isLapTop ? '16px' : '10px',
              '& .MuiInputBase-input': {
                typography: 'x-small',
              },
            }}
            onChange={(e: SelectChangeEvent<number[]>) => {
              // e.target.valueはnumber[]になる
              setFilterPeriod(e.target.value as number[]);
            }}
            size={isLapTop ? 'medium' : 'small'}
            renderValue={(selected) => selected.join(', ')}
          >
            {[1, 2, 3, 4, 5, 6].map((period) => (
              <MenuItem
                key={period}
                value={period} // number型
                sx={{
                  minHeight: 0,
                  fontSize: isLapTop ? '16px' : '10px',
                  '&.MuiMenuItem-gutters': {
                    paddingY: 1,
                  },
                }}
              >
                <Typography variant="small">{period}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* ボタン */}
      <Box sx={{ display: 'flex', width: '100%', columnGap: 1 }}>
        <Button
          fullWidth
          sx={{ margin: 0.5 }}
          variant="contained"
          onClick={() => clearFilter()}
        >
          <Typography variant="small">クリア</Typography>
        </Button>

        <Button
          fullWidth
          sx={{ margin: 0.5 }}
          variant="contained"
          onClick={() => setIsDetailSearchBoxOpened(false)}
        >
          <Typography variant="small">閉じる</Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default memo(DetailSearchBox);
