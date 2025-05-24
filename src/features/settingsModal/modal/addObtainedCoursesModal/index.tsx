import { Box } from '@mui/material';
import { useState } from 'react';

import { MediumModal } from '@/components/CustomModal';

import ConfirmRegistrationView from './ConfirmRegistrationView';
import { useAddObtainedCoursesModal } from './hook';
import RegistrationView from './RegistrationView';

export type AddObtainedCoursesModalView = 'regist' | 'confirmRegist';

export default function AddObtainedCoursesModal() {
  const [isOpen, setIsOpen] = useAddObtainedCoursesModal();

  const [view, setView] = useState<AddObtainedCoursesModalView>('regist');

  const [obtainedCourseString, setObtainedCourseString] = useState<string>('');
  return (
    <MediumModal open={isOpen} onClose={() => setIsOpen(false)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        {view === 'regist' ? (
          <RegistrationView
            obtainedCourseString={obtainedCourseString}
            setObtainedCourseString={setObtainedCourseString}
            setView={setView}
          />
        ) : (
          <ConfirmRegistrationView
            obtainedCourseString={obtainedCourseString}
            setView={setView}
          />
        )}
      </Box>
    </MediumModal>
  );
}
