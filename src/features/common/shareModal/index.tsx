import QrCode2Icon from '@mui/icons-material/QrCode2';
import {
  Alert,
  Box,
  Button,
  Modal,
  ToggleButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { memo, useState } from 'react';

import { MediumModal } from '@/components/CustomModal';
import QRCode from '@/components/QRCode';
import { useLocalStorageManagement } from '@/hooks/localStorageManagement';
import { useSettingCode } from '@/hooks/settingCode';
import { SettingCode } from '@/types/settingCode';

import { useShareModal } from './hook';

type InclusionMode = 'all' | 'facultyRequirements';

function ShareModal() {
  const {
    localFacultyRequirements,
    localTags,
    localObtainedCourseIds,
    localCourseEnrolledYears,
    localPastCourseIds,
    localClassrooms,
  } = useLocalStorageManagement();

  const theme = useTheme();
  const isLapTop = useMediaQuery(theme.breakpoints.up('laptop'));

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const { code, addSettingCode } = useSettingCode();

  const [isModalOpen, setIsModalOpen] = useShareModal();

  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);

  // モードを管理
  const [inclusionMode, setInclusionMode] = useState<InclusionMode>('all');

  const generateCopyData = (option: InclusionMode): SettingCode => {
    if (option === 'all') {
      return {
        inclusionMode: 'all',
        facultyRequirements: localFacultyRequirements,
        tags: localTags,
        obtainedCourseIds: localObtainedCourseIds,
        courseEnrolledYears: localCourseEnrolledYears,
        pastCourseIds: localPastCourseIds,
        classrooms: localClassrooms,
      };
    }
    if (option === 'facultyRequirements') {
      return {
        inclusionMode: 'facultyRequirements',
        facultyRequirements: localFacultyRequirements,
        tags: localTags,
        obtainedCourseIds: [],
        courseEnrolledYears: [],
        pastCourseIds: [],
        classrooms: [],
      };
    } else {
      return {
        inclusionMode: 'all',
        facultyRequirements: localFacultyRequirements,
        tags: localTags,
        obtainedCourseIds: localObtainedCourseIds,
        courseEnrolledYears: localCourseEnrolledYears,
        pastCourseIds: localPastCourseIds,
        classrooms: localClassrooms,
      };
    }
  };

  return (
    <MediumModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="x-small">
              共有する情報を選択し、設定コードを生成してください。「設定」➡「設定コードで設定を登録」より設定コードを入力することで、他の端末に設定を共有できます。
            </Typography>

            <Typography variant="x-small">
              ※はじめてスマートフォンに設定を共有する場合は、QRコードを使用すると簡単です。
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { mobile: 'column', laptop: 'row' },
              width: '100%',
              columnGap: 2,
              rowGap: 1,
              mt: 2,
            }}
          >
            <ToggleButton
              sx={{
                width: { mobile: '100%', laptop: '50%' },
                backgroundColor: 'white !important',
                border: () =>
                  inclusionMode === 'all'
                    ? `1.5px solid black`
                    : '1px solid gray', // Add border if selected
              }}
              value="check"
              selected={inclusionMode === 'all'}
              onClick={() => setInclusionMode('all')}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant="x-small"
                  sx={{ fontWeight: 'bold' }}
                  gutterBottom
                >
                  全ての情報を共有
                </Typography>
                <Typography variant="xx-small">
                  学部情報（学部名・必修・選択必修・タグ）、取得済の授業、時間割に登録している授業、教室情報。
                </Typography>
                <Typography variant="xx-small">
                  1回のみ使用でき、その後アクセス不可になります。
                </Typography>
              </Box>
            </ToggleButton>

            <ToggleButton
              sx={{
                backgroundColor: 'white !important',
                width: { mobile: '100%', laptop: '50%' },
                border: () =>
                  inclusionMode === 'facultyRequirements'
                    ? `1.5px solid black`
                    : '1px solid gray', // Add border if selected
              }}
              value="check"
              selected={inclusionMode === 'facultyRequirements'}
              onClick={() => setInclusionMode('facultyRequirements')}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant="x-small"
                  sx={{ fontWeight: 'bold' }}
                  gutterBottom
                >
                  学部情報のみ共有
                </Typography>
                <Typography variant="xx-small">
                  学部情報（学部名・必修・選択必修・タグ）
                </Typography>
                <Typography variant="xx-small">
                  何回でも使用できます。
                </Typography>
              </Box>
            </ToggleButton>
          </Box>
        </Box>

        <Button
          sx={{ width: '100%', mt: 1 }}
          variant="contained"
          color="secondary"
          onClick={() => {
            generateCopyData(inclusionMode);
            addSettingCode(generateCopyData(inclusionMode));
          }}
        >
          <Typography variant="x-small">設定コードを生成する</Typography>
        </Button>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 0.5,
          }}
        >
          <Box
            sx={{
              width: '100%',
              borderRadius: 1,
              backgroundColor: 'grey.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1,
              position: 'relative',
            }}
          >
            {/* QRコードボタン（右寄せ） */}
            {isLapTop && (
              <Box sx={{ ml: 'auto', mr: 1.5 }}>
                <Button
                  disabled={!code}
                  onClick={() => setIsQRCodeOpen(true)}
                  size="small"
                  variant="outlined"
                  color="inherit"
                  sx={{ minWidth: '32px', p: 0.5 }}
                >
                  <QrCode2Icon fontSize="small" />
                </Button>
              </Box>
            )}

            {/* 設定コード（中央寄せ） */}
            <Typography
              variant="large"
              sx={{
                fontWeight: 'bold',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              {code || '設定コード'}
            </Typography>
          </Box>

          <Modal open={isQRCodeOpen} onClose={() => setIsQRCodeOpen(false)}>
            <Box
              sx={{
                width: 720,
                height: 520,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                border: '2px solid #000',
                borderRadius: '5px',
                boxShadow: 24,
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="x-small">
                    スマートフォンでQRコードを読み取ると、設定コードを入力せずにアプリを始められます。
                  </Typography>
                  <Typography variant="x-small">
                    注意：既に設定を登録しているスマートフォンに対しては使用できません。
                  </Typography>
                </Box>

                <QRCode url={`${baseUrl}?code=${code}`} />
              </Box>

              <Button
                sx={{ mt: 'auto', width: '100%' }}
                variant="outlined"
                onClick={() => setIsQRCodeOpen(false)}
              >
                <Typography variant="x-small">閉じる</Typography>
              </Button>
            </Box>
          </Modal>

          {/* TODO: URLで共有できるべきかも */}
          {/* <Button
            disabled={!code}
            sx={{ mt: 1 }}
            variant="outlined"
            onClick={() => {
              if (code && code !== '') {
                navigator.clipboard.writeText(`${baseUrl}?code=${code}`);
              }
            }}
          >
            <Typography variant="x-small">共有URLをコピー</Typography>
          </Button> */}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
          <Alert severity="warning" sx={{ alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="xx-small">
                ・アクセス不可、または６か月以上使用されていない設定コードはデータベースから削除されます。
              </Typography>
              <Typography variant="xx-small">
                ・設定情報に学内専用の情報が含まれている場合、設定コードは学外の人に共有しないでください。
              </Typography>
            </Box>
          </Alert>
        </Box>
      </Box>
    </MediumModal>
  );
}

export default memo(ShareModal);
