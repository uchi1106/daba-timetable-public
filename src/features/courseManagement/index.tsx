import { Box } from '@mui/material';
import React from 'react';

import { useCourses } from '@/hooks/course';
import { useFacultyRequirements } from '@/hooks/facultyRequirement';

import FacultyRequirementDisplay from './facultyRequirementDisplay';

export const CourseManagement: React.FC = () => {
  const { courses } = useCourses();
  const { facultyRequirements } = useFacultyRequirements();

  return (
    <Box sx={{ m: 1, display: 'flex', flexDirection: 'column' }}>
      {facultyRequirements.map((facultyRequirement) => {
        const targetCourses = courses.filter(
          (course) => course.faculty === facultyRequirement.facultyName
        );
        return (
          <FacultyRequirementDisplay
            key={facultyRequirement.facultyName}
            facultyRequirement={facultyRequirement}
            courses={targetCourses}
          />
        );
      })}
    </Box>
  );
};
