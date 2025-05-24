import { Box, Button, ButtonGroup, TextField, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

import { AddObtainedCoursesModalView } from '.';
import { useAddObtainedCoursesModal } from './hook';

interface Props {
  obtainedCourseString: string;
  setObtainedCourseString: Dispatch<SetStateAction<string>>;
  setView: Dispatch<SetStateAction<AddObtainedCoursesModalView>>;
}

export default function RegistrationView({
  obtainedCourseString,
  setObtainedCourseString,
  setView,
}: Props) {
  const [, setIsOpen] = useAddObtainedCoursesModal();

  return (
    <>
      <Box sx={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="xx-small">
          教務システムの「履修・成績情報」の「成績参照」から「成績明細」を表示し、
          <strong>合格した</strong>全ての成績が載っている画面を開いてください。
          その画面の文字を Ctrl + A（全選択）→ Ctrl + C（コピー）
          して貼り付けてください。
        </Typography>
        <Typography variant="xx-small">
          ※授業の年度と時間割コードが含まれていれば問題ありません。
        </Typography>

        <TextField
          multiline
          rows={13}
          sx={{
            mt: 1,
            width: '100%',
            // TODO: これはテーマの設定によって変更し、全体で統一するべきかも
            '& .MuiInputBase-input': {
              fontSize: { mobile: '0.5rem', laptop: '0.8rem' }, // または任意のサイズ
              lineHeight: { mobile: '1.3', laptop: '1.5' }, // 行の高さを調整
            },
          }}
          type="text"
          value={obtainedCourseString}
          onChange={(e: {
            target: { value: React.SetStateAction<string> };
          }) => {
            setObtainedCourseString(e.target.value);
          }}
        />
      </Box>

      <ButtonGroup sx={{ mt: 2 }}>
        <Button
          onClick={() => {
            setIsOpen(false);
          }}
          sx={{ width: '50%' }}
        >
          <Typography variant="xx-small">キャンセル</Typography>
        </Button>
        <Button
          disabled={obtainedCourseString === ''}
          onClick={() => {
            setView('confirmRegist');
          }}
          sx={{ width: '50%' }}
        >
          <Typography variant="xx-small">登録</Typography>
        </Button>
      </ButtonGroup>
    </>
  );
}
