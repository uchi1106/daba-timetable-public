import { FilterList } from '@mui/icons-material';
import {
  Badge,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import React, { useCallback, useEffect, useState } from 'react';

import { useCourses } from '@/hooks/course';
import {
  filterDayAtom,
  filterPeriodAtom,
  filterTermAtom,
} from '@/hooks/filterSchedule';
import { Course, Term } from '@/types/course';

import DetailSearchBox from './DetailSearchBox';
import { selectQualifiedCourses } from './filterCourses';

export type FilterState = {
  targetName: string;
  targetFaculty: string;
  targetInstructor: string;
  targetTags: string[];
  targetRequiredGrades: number[];
  isRequired: boolean;
  isNotRequired: boolean;
  isObtained: boolean;
  isNotObtained: boolean;
};

export type FilterValue<K extends keyof FilterState> = FilterState[K];

interface CourseSearchBarProps {
  setFilteredCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

const CourseSearchBar: React.FC<CourseSearchBarProps> = ({
  setFilteredCourses,
}) => {
  const isLapTop = useMediaQuery((theme) => theme.breakpoints.up('laptop'));

  const { courses } = useCourses();

  // これらは外部から変更されるのでのでatomとして全体で管理する。FilterStateにはこれらの値は持たない。
  // ただし、targetTermのみはここでもつ値と外部で持つ値の二つの状態を保持する必要があるため、FilterStateにも持たせる
  const [filterTerm, setFilterTerm] = useAtom(filterTermAtom);
  const filterDay = useAtomValue(filterDayAtom);
  const filterPeriod = useAtomValue(filterPeriodAtom);

  const [isDetailSearchBoxOpened, setIsDetailSearchBoxOpened] = useState(false);

  const [filter, setFilter] = useState<FilterState>({
    targetName: '',
    targetFaculty: '',
    targetInstructor: '',
    targetTags: [],
    targetRequiredGrades: [],
    isRequired: false,
    isNotRequired: false,
    isObtained: false,
    isNotObtained: false,
  });

  const getAmountOfCondition = () => {
    let amount = 0;
    if (filter.targetName !== '') amount++;
    if (filter.targetFaculty !== '') amount++;
    if (filter.targetInstructor !== '') amount++;
    amount += filter.targetTags.length;
    amount += filter.targetRequiredGrades.length;
    if (filter.isRequired) amount++;
    if (filter.isNotRequired) amount++;
    if (filter.isObtained) amount++;
    if (filter.isNotObtained) amount++;
    if (filterDay.length > 0) amount++;
    if (filterPeriod.length > 0) amount++;
    // 学期は filterTerm で管理されているが、FilterState には含まれないため、ここではカウントしない
    // フィルターをクリアしたときにもfilterTermは変わらないため、amountは変わらない
    return amount;
  };

  // handleFilterChange を useCallback でラップ
  const handleFilterChange = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterValue<K>) => {
      setFilter((prev) => {
        const newFilter = { ...prev, [key]: value };
        return newFilter;
      });
    },
    []
  );

  // TODO: useEffect を使わない方法で実装する
  // useEffect(() => {
  //   setFilter((prev) => ({ ...prev, targetTerm }));
  // }, [targetTerm, setFilter]);

  // TODO: useEffect を使わない方法で実装する
  useEffect(() => {
    const newFilteredCourses = selectQualifiedCourses(
      courses,
      filter.targetName,
      filter.targetFaculty,
      filter.targetInstructor,
      filterTerm,
      filter.targetTags,
      filter.targetRequiredGrades,
      filter.isRequired,
      filter.isNotRequired,
      filter.isObtained,
      filter.isNotObtained,
      filterDay,
      filterPeriod
    );
    setFilteredCourses(newFilteredCourses);
  }, [
    filter,
    courses,
    setFilteredCourses,
    filterDay,
    filterPeriod,
    filterTerm,
  ]);

  return (
    <Box
      sx={{
        top: 0,
        backgroundColor: 'white',
        zIndex: 1,
        pt: { mobile: 0.5, laptop: 2 },
        pr: { mobile: 1, laptop: 3 },
        pl: 0.5,
        pb: { mobile: 0.5, laptop: 1 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          columnGap: 1,
          alignItems: 'center',
          position: 'sticky',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          {/* 詳細検索ボックスを開くボタン */}
          <Button
            sx={{
              borderRadius: '50%',
              p: 0,
              minWidth: 45,
              width: 40,
              height: 45,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={() => setIsDetailSearchBoxOpened((prev) => !prev)}
          >
            <Badge badgeContent={getAmountOfCondition()} color="primary">
              <FilterList />
            </Badge>
          </Button>
        </Box>

        {/* コース名 */}
        <FormControl fullWidth>
          <TextField
            size={isLapTop ? 'medium' : 'small'}
            value={filter.targetName}
            onChange={(e) => handleFilterChange('targetName', e.target.value)}
            placeholder="授業名"
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

        {/* 学期 */}
        <FormControl
          sx={{
            width: { mobile: 130, laptop: 160 },
          }}
          size={isLapTop ? 'medium' : 'small'}
        >
          <InputLabel>
            <Typography variant="x-small">学期</Typography>
          </InputLabel>
          <Select
            size={isLapTop ? 'medium' : 'small'}
            sx={{
              fontSize: isLapTop ? '16px' : '10px',
            }}
            value={filterTerm}
            label="学期"
            onChange={(e) => setFilterTerm(e.target.value as Term | '')}
          >
            <MenuItem
              value=""
              sx={{
                minHeight: 0,
                fontSize: isLapTop ? '16px' : '10px',
                '&.MuiMenuItem-gutters': {
                  paddingY: 1,
                },
              }}
            >
              <Typography variant="x-small">全て</Typography>
            </MenuItem>
            <MenuItem
              value="前期"
              sx={{
                minHeight: 0,
                fontSize: isLapTop ? '16px' : '10px',
                '&.MuiMenuItem-gutters': {
                  paddingY: 1,
                },
              }}
            >
              <Typography variant="x-small">前期</Typography>
            </MenuItem>
            <MenuItem
              value="後期"
              sx={{
                minHeight: 0,
                fontSize: isLapTop ? '16px' : '10px',
                '&.MuiMenuItem-gutters': {
                  paddingY: 1,
                },
              }}
            >
              <Typography variant="x-small">後期</Typography>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {isDetailSearchBoxOpened && (
        <DetailSearchBox
          handleFilterChange={handleFilterChange}
          filter={filter}
          setFilter={setFilter}
          setIsDetailSearchBoxOpened={setIsDetailSearchBoxOpened}
        />
      )}
    </Box>
  );
};

export default CourseSearchBar;
