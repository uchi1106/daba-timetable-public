import { Box, useMediaQuery, useTheme } from '@mui/material';
import { FC, memo, useEffect, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';

import { useCourses } from '@/hooks/course';
import { Course } from '@/types/course';

import CourseItem from '../common/CourseItem';
import CourseSearchBar from './CourseSearchBar';

const AllCourses: FC = () => {
  const { courses } = useCourses();
  const theme = useTheme();
  const isLaptop = useMediaQuery(theme.breakpoints.up('laptop'));

  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);

  // 初期値として仮の高さを設定
  const listRef = useRef<FixedSizeList>(null);
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      const searchBarHeight =
        document.querySelector('.course-search-bar')?.clientHeight || 0;
      setListHeight(window.innerHeight - searchBarHeight);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const Row: FC<{ index: number; style: React.CSSProperties }> = ({
    index,
    style,
  }) => (
    <div style={style}>
      {/* CourseItem内のuseDragableに一意なキーを設定するためidをプロップスで渡す */}
      {/* ElectiveRequirementDisplayから呼び出されているCourseItemと被る恐れがあるため、course_idはここにおいてキーとして使用できない */}
      <CourseItem course={filteredCourses[index]} id={`allCourses${index}`} />
    </div>
  );

  return (
    <>
      <Box className="course-search-bar">
        <CourseSearchBar setFilteredCourses={setFilteredCourses} />
      </Box>
      <FixedSizeList
        ref={listRef}
        height={listHeight}
        width="98%"
        itemSize={isLaptop ? 100 : 82}
        itemCount={filteredCourses.length}
        overscanCount={5}
      >
        {Row}
      </FixedSizeList>
    </>
  );
};

export default memo(AllCourses);
