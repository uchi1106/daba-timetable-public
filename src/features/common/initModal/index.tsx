import { ImportContacts, School } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Grid,
  Link,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { useCodeInput } from '@/components/CodeInput';
import { LargeModal } from '@/components/CustomModal';
import { useLocalStorageManagement } from '@/hooks/localStorageManagement';
import { useSettingCode } from '@/hooks/settingCode';
import { FacultyRequirement } from '@/types/facultyRequirement';

import { useUsageNotesModal } from '../usageNotesModal/hook';
import { useInitModal } from './hook';

export default function InitModal() {
  const theme = useTheme();
  const isLapTop = useMediaQuery(theme.breakpoints.up('laptop'));

  const [isModalOpen, setIsModalOpen] = useInitModal();

  const [, setIsUsageNotesModal] = useUsageNotesModal();
  useEffect(() => {
    if (typeof window === 'object') {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      // URLのクエリパラメータからcodeを取得して、4文字目までをinputCodeにセット
      setInputCode(code ? [...code].slice(0, 4) : []);
    }
  }, []);
  // モードを管理
  const [settingMode, setSettingMode] = useState<'code' | 'faculty'>('code');

  // 入力を保持。codeParamがある場合はそれを初期値にする
  const [inputCode, setInputCode] = useState<string[]>([]);
  const { isValidInputCode, render } = useCodeInput(4)(inputCode, setInputCode);

  const { longCode, fetchSettingCode } = useSettingCode();

  const [selectedFaculty, setSelectedFaculty] = useState<
    '教育学部' | '情報学部' | '医学部' | '理工学部'
  >('情報学部');

  const { updateLocalFacultyRequirements } = useLocalStorageManagement();

  // TODO: useEffectを使わない
  useEffect(() => {
    // TODO: ページをリロードせずにローカルストレージに保存された情報を反映する
    if (longCode) {
      window.location.reload(); // ページをリロードしてローカルストレージに保存された情報を反映する
    }
  }, [longCode]);

  const handleCodeEnroll = () => {
    // データベースから長い設定コードを取得して、ローカルを更新
    fetchSettingCode(inputCode.join(''));
  };

  const handleFacultyEnroll = () => {
    // ローカルストレージに情報を保存

    // 登録するときに投げ込む '教養教育',
    const facultyRequirements: FacultyRequirement[] = [
      selectedFaculty,
      '教養教育',
    ].map((facultyName) => {
      return {
        facultyRequirementId: facultyName,
        facultyName: facultyName,
        credits: 0, // Add appropriate value
        requirements: [],
        electiveRequirements: [],
        requiredCourseNames: [],
        obtainedCourseIds: [],
      };
    });

    updateLocalFacultyRequirements(facultyRequirements);

    // TODO: ページをリロードせずにローカルストレージに保存された情報を反映する
    window.location.reload(); // ページをリロードしてローカルストレージに保存された情報を反映する

    setIsModalOpen(false);
  };

  return (
    <LargeModal open={isModalOpen}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box>
            <Box sx={{ display: 'flex' }}>
              <School />
              <Typography
                variant="medium"
                sx={{ fontWeight: 'bold', ml: 2 }}
                gutterBottom
              >
                アプリ「だばの時間割」について
              </Typography>
            </Box>

            <Typography variant="x-small" sx={{ display: 'block' }}>
              だばの時間割は群大生の履修管理をサポートするアプリです
            </Typography>
            <Typography
              variant="x-small"
              sx={{ lineHeight: '1.5', display: 'block' }}
            >
              スマートフォンの方は先に
              <Link href="https://curio-shiki.com/blog/smartphone/shortcut-on-home#toc1">
                スマホアプリ化
              </Link>
              することを強く推奨します
            </Typography>
          </Box>

          <Tabs
            centered
            variant="fullWidth"
            value={settingMode}
            sx={{ mt: { mobile: 0, laptop: 2 } }}
          >
            <Tab
              label="設定コードで登録"
              value={'code'}
              sx={{
                fontSize: isLapTop ? '1rem' : '0.7rem',
                padding: { mobile: 0 },
              }}
              onClick={() => setSettingMode('code')}
            />
            <Tab
              label="学部のみ登録"
              value={'faculty'}
              sx={{
                fontSize: isLapTop ? '1rem' : '0.7rem',
                padding: { mobile: 0 },
              }}
              onClick={() => setSettingMode('faculty')}
            />
          </Tabs>
        </Box>
        {settingMode === 'code' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              sx={{ textAlign: 'center' }}
              variant="small"
              gutterBottom
            >
              設定コードを入力してください
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {render()}
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="small" gutterBottom>
              学部を選択
            </Typography>
            <Grid container spacing={1} size={12}>
              <Grid size={6}>
                <Button
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: { mobile: 40, laptop: 50 },
                    px: 2.5,
                    border: 'solid 1px',
                  }}
                  variant={
                    selectedFaculty === '教育学部' ? 'contained' : 'outlined'
                  }
                  onClick={() => setSelectedFaculty('教育学部')}
                  disabled
                >
                  <ImportContacts />
                  <Typography variant="small">教育学部</Typography>
                </Button>
              </Grid>
              <Grid size={6}>
                <Button
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: { mobile: 40, laptop: 50 },
                    px: 2.5,
                    border: 'solid 1px',
                  }}
                  variant={
                    selectedFaculty === '情報学部' ? 'contained' : 'outlined'
                  }
                  onClick={() => setSelectedFaculty('情報学部')}
                >
                  <ImportContacts />
                  <Typography variant="small">情報学部</Typography>
                </Button>
              </Grid>
              <Grid size={6}>
                <Button
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: { mobile: 40, laptop: 50 },
                    px: 2.5,
                    border: 'solid 1px',
                  }}
                  variant={
                    selectedFaculty === '医学部' ? 'contained' : 'outlined'
                  }
                  onClick={() => setSelectedFaculty('医学部')}
                  disabled
                >
                  <ImportContacts />
                  <Typography variant="small">医学部</Typography>
                </Button>
              </Grid>
              <Grid size={6}>
                <Button
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: { mobile: 40, laptop: 50 },
                    px: 2.5,
                    border: 'solid 1px',
                  }}
                  variant={
                    selectedFaculty === '理工学部' ? 'contained' : 'outlined'
                  }
                  onClick={() => setSelectedFaculty('理工学部')}
                  disabled
                >
                  <ImportContacts />
                  理工学部
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Alert
            severity="warning"
            sx={{ alignItems: 'center', py: { mobile: 0, laptop: 1 } }}
          >
            <Typography
              variant="xx-small"
              sx={{ lineHeight: 1.6, display: 'block' }}
            >
              非公式のアプリであるため、大学公式の情報と照らし合わせながら自己責任でご利用ください。
              また、利用上の注意およびプライバシーポリシーに同意のうえでご利用いただくものとします。
              内容は以下の「詳細」からご確認ください。
            </Typography>
          </Alert>

          <Grid
            container
            alignItems="center"
            spacing={1}
            size={12}
            sx={{ mt: 2 }}
          >
            <Grid size={4}>
              <Button
                sx={{ width: '100%', fontSize: isLapTop ? '0.8rem' : '0.6rem' }}
                variant="outlined"
                color="inherit"
                onClick={() => setIsUsageNotesModal(true)}
              >
                <Typography variant="x-small">詳細</Typography>
              </Button>
            </Grid>
            <Grid size={8}>
              <Button
                sx={{ width: '100%' }}
                variant="contained"
                color="secondary"
                onClick={
                  settingMode === 'code'
                    ? () => handleCodeEnroll()
                    : () => handleFacultyEnroll()
                }
                disabled={
                  (settingMode === 'code' && isValidInputCode(inputCode)) ||
                  settingMode === 'faculty'
                    ? false
                    : true
                }
              >
                <Typography variant="x-small">登録する</Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </LargeModal>
  );
}
