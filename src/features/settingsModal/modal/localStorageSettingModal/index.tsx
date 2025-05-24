import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { useCodeInput } from '@/components/CodeInput';
import { SmallModal } from '@/components/CustomModal';
import { useSettingCode } from '@/hooks/settingCode';

import { useLocalStorageSettingModal } from './hook';

export default function LocalStorageSettingModal() {
  const [isOpen, setIsOpen] = useLocalStorageSettingModal();

  // TODO: エラー処理を書く。正しく設定コードが読み込めなかったときにエラーを表示する

  // 設定用のコード
  const [inputCode, setInputCode] = useState<string[]>([]);
  const { isValidInputCode, render } = useCodeInput(4)(inputCode, setInputCode);

  const { longCode, fetchSettingCode } = useSettingCode();

  // TODO: useEffectを使わない
  useEffect(() => {
    // TODO: ページをリロードせずにローカルストレージに保存された情報を反映する
    if (longCode && longCode !== '') {
      window.location.reload(); // ページをリロードしてローカルストレージに保存された情報を反映する
    }
  }, [longCode]);

  const handleEnroll = () => {
    // データベースから長い設定コードを取得して、ローカルを更新
    fetchSettingCode(inputCode.join(''));
  };

  return (
    <SmallModal open={isOpen} onClose={() => setIsOpen(false)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="xx-small">
            設定コードから設定情報を登録します。既存の情報が上書きされます。
          </Typography>
          <Typography variant="xx-small">
            設定コードは「共有」から生成できます。
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>{render()}</Box>

        <ButtonGroup>
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
              handleEnroll();
            }}
            sx={{ width: '50%' }}
            disabled={!isValidInputCode(inputCode)}
          >
            <Typography variant="xx-small">登録</Typography>
          </Button>
        </ButtonGroup>
      </Box>
    </SmallModal>
  );
}
