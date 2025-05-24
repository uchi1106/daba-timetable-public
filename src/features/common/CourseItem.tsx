import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Box, Card, Chip, Typography } from '@mui/material';
import { FC, memo } from 'react';

import {
  NotObtainedBadge,
  ObtainedBadge,
  RequiredBadge,
} from '@/components/CustomBadge';
import { EnrollYearBadge } from '@/components/EnrollYearBadge';
import { Course } from '@/types/course';

import { useCourseDetailModal } from './courseDetailModal/hook';

interface CourseItemProps {
  course: Course;
  id?: string;
}

const CourseItem: FC<CourseItemProps> = ({ course, id }) => {
  const [, setCourse] = useCourseDetailModal();

  const { isDragging, attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: id ? id : course.course_id,
      data: course,
    });

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      sx={{
        mx: { mobile: 0.5, laptop: 0 },
        bgcolor: 'white',
        p: { mobile: 0.5, laptop: 1 },
        height: { mobile: '78px', laptop: '98px' },
      }}
      onClick={() => setCourse(course)}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
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
            <Typography
              variant="small"
              sx={{ display: { mobile: 'none', laptop: 'inline' } }}
            >
              {course.course_id}
            </Typography>
            <Typography
              variant="small"
              sx={{ ml: { mobile: 0, laptop: 1 }, fontWeight: 'bold' }}
            >
              {course.course_name}
            </Typography>
            <Typography variant="small" sx={{ ml: 3 }}>
              {course.instructor}
            </Typography>
          </Box>

          {course.tags.length > 0 ? (
            <Box
              sx={{
                display: '-webkit-box',
                width: '100%',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 1,
                height: { mobile: 22, laptop: 26 },
              }}
            >
              {course.tags.map((tag) => (
                <Chip
                  sx={{
                    mr: 1,
                    padding: 0,
                    height: { mobile: 16, laptop: 24 },
                  }}
                  key={tag}
                  label={
                    <Typography sx={{ fontSize: { mobile: 8, laptop: 14 } }}>
                      {tag}
                    </Typography>
                  }
                />
              ))}
            </Box>
          ) : (
            <Typography variant="x-small">タグなし</Typography>
          )}

          <Box
            sx={{
              mt: 'auto',
              width: '100%',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 3 }}>
              {course.dates &&
                course.dates.map((date, index) => (
                  <Box key={index} sx={{ display: 'flex', columnGap: 1 }}>
                    <Typography noWrap variant="x-small">
                      {date.term}
                    </Typography>
                    <Typography noWrap variant="x-small">
                      {date.day}
                    </Typography>
                    <Typography noWrap variant="x-small">
                      {date.period?.join(',')}コマ
                    </Typography>
                  </Box>
                ))}

              <Box sx={{ display: 'flex', columnGap: 2 }}>
                {course.required_grade && (
                  <Typography noWrap variant="x-small">
                    {course.required_grade}年次～
                  </Typography>
                )}

                <Typography
                  noWrap
                  variant="x-small"
                >{`${course.credits}単位`}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            diplsplay: 'flex',
            flexDirection: 'column',
            ml: 'auto',
            pl: 1,
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: 0.5,
              justifyContent: 'right',
              height: course.enrolled_year ? '75%' : '100%',
            }}
          >
            {course.required && <RequiredBadge />}
            {course.obtained ? <ObtainedBadge /> : <NotObtainedBadge />}
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'right',
              mr: { mobile: '0px', laptop: '2px' },
            }}
          >
            {course.enrolled_year && (
              <EnrollYearBadge year={course.enrolled_year} />
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default memo(CourseItem);
