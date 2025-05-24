'use client';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { memo, useEffect, useState } from 'react';

import { SnackbarQueue } from '@/components/SnackbarQueue';
import { CourseDetailModal } from '@/features/common/courseDetailModal';
import FirstTimeGuideModal from '@/features/common/firstTimeGuideModal';
import { useFirstTimeGuideModal } from '@/features/common/firstTimeGuideModal/hook';
import InitModal from '@/features/common/initModal';
import ShareModal from '@/features/common/shareModal';
import UsageNotesModal from '@/features/common/usageNotesModal';
import { DeleteElectiveRequirementModal } from '@/features/courseManagement/facultyRequirementDisplay/deleteElectiveRequirementModal';
import EditElectiveRequirementModal from '@/features/courseManagement/facultyRequirementDisplay/editElectiveRequirementModal';
import { ElectiveRequirementMenuPopup } from '@/features/courseManagement/facultyRequirementDisplay/electiveRequirementMenuPopup';
import DoublePanel from '@/features/layout/doublePanel';
import SinglePanel from '@/features/layout/soloPanel';
import SettingsModal from '@/features/settingsModal';
import ElectiveRequirementRegistrationModal from '@/features/settingsModal/modal/addElectiveRequirementModal';
import CourseRegistrationModal from '@/features/settingsModal/modal/addObtainedCoursesModal';
import RequiredCourseEnrollmentModal from '@/features/settingsModal/modal/editRequiredCourseModal';
import LocalStorageSettingModal from '@/features/settingsModal/modal/localStorageSettingModal';
import ResetConfirmModal from '@/features/settingsModal/modal/resetSettingModal';
import TagToCoursesModal from '@/features/settingsModal/modal/tagToCoursesModal';
import { useAppInitializer } from '@/hooks/appInitializer';

const HomeLayout = () => {
  // 全てのコースをフェッチし、ローカルストレージの変更を取り込む
  useAppInitializer();

  const theme = useTheme();
  const isDoublePanel = useMediaQuery(theme.breakpoints.up('laptop'));

  // isDoublePanelがサーバーサイドで計算されい正しい値を取得するまでの間に画面が表示されると、必ずSinglePanelが表示されるため、
  // 画面が表示されるまでの間描画を遅延させるために２つのuseStateを使用
  const [firstIsDoublePanel, setFirstIsDoublePanel] = useState<
    boolean | undefined
  >(undefined);
  const [secondIsDoublePanel, setSecondIsDoublePanel] = useState<
    boolean | undefined
  >(undefined);

  useEffect(() => {
    if (firstIsDoublePanel !== undefined) {
      setSecondIsDoublePanel(firstIsDoublePanel);
    }

    if (isDoublePanel === true) {
      setSecondIsDoublePanel(isDoublePanel);
    }

    setFirstIsDoublePanel(isDoublePanel);
  }, [firstIsDoublePanel]);

  const [, setIsModalOpen] = useFirstTimeGuideModal();

  return (
    <Box
      sx={{
        overflow: 'auto',
        position: 'fixed',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
      }}
    >
      {/* TODO: isDoublePanelの計算が終了してから画面を表示するようにする */}
      {secondIsDoublePanel ? (
        <DoublePanel />
      ) : secondIsDoublePanel === false ? (
        <SinglePanel />
      ) : (
        <></>
      )}

      {isDoublePanel && (
        <Button
          variant="contained"
          color="success"
          sx={{
            position: 'fixed',
            bottom: 25,
            right: 45,
            borderRadius: '24px',
          }}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <InfoOutlinedIcon sx={{ width: 24, height: 24 }} />

          <Typography sx={{ ml: 1 }} variant="x-small">
            はじめての方へ
          </Typography>
        </Button>
      )}

      <SnackbarQueue />

      {/* コース詳細モーダル。LeftPanel・RightPanel両方から呼び出されるためここに設置 */}
      <CourseDetailModal />

      <InitModal />

      <UsageNotesModal />

      <ShareModal />

      <FirstTimeGuideModal />

      <SettingsModal />

      {/* 以下はSettingsModalから呼び出されるためここに設置 */}

      <TagToCoursesModal />

      <CourseRegistrationModal />

      <LocalStorageSettingModal />

      <ElectiveRequirementRegistrationModal />

      <RequiredCourseEnrollmentModal />

      <EditElectiveRequirementModal />

      <DeleteElectiveRequirementModal />

      <ElectiveRequirementMenuPopup />

      <ResetConfirmModal />
    </Box>
  );
};

export default memo(HomeLayout);
