import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Link, Stack, Typography } from '@mui/material';
import { memo, useState } from 'react';

import { LargeModal } from '@/components/CustomModal';

import { useFirstTimeGuideModal } from './hook';

const images = [
  '/firstTimeGuideModal/1.png',
  '/firstTimeGuideModal/2.png',
  '/firstTimeGuideModal/3.png',
  '/firstTimeGuideModal/4.png',
  '/firstTimeGuideModal/5.png',
  '/firstTimeGuideModal/6.png',
  '/firstTimeGuideModal/7.png',
  '/firstTimeGuideModal/8.png',
  '/firstTimeGuideModal/9.png',
  '/firstTimeGuideModal/10.png',
  '/firstTimeGuideModal/11.png',
  '/firstTimeGuideModal/12.png',
  '/firstTimeGuideModal/13.png',
  '/firstTimeGuideModal/14.png',
];

const titles = [
  '取得済みの授業を登録する①',
  '取得済みの授業を登録する②',
  '取得済みの授業を登録する③',
  '取得済みの授業を登録する④',
  '授業の取得状況を確認する',
  '時間割を確認する',
  '授業を検索・絞り込む',
  '授業の詳細を見る',
  '仮取得済として登録する',
  '教室情報をまとめて登録する',
  '設定をスマホと共有する①',
  '設定をスマホと共有する②',
  '設定をスマホと共有する③',
  '設定をスマホと共有する④',
];

const descriptions = [
  '画面右上の「設定」をクリックします。',
  '「授業を一括で取得済に登録」を選びます。',
  '教務システムの「成績明細」をコピーして貼り付け、「登録」を押します。',
  '「確定する」をクリックすると該当の授業が取得済として登録されます。',
  '「取得状況」をクリックすると、現在の取得済・未取得の授業一覧を確認できます。',
  '「時間割」をクリックすると、登録した授業の時間割を確認できます。',
  '左上のフィルターボタンから、授業の検索や絞り込みができます。',
  '授業をクリックすると詳細が表示されます。「○○年に登録」ボタンから時間割に追加することも可能です。',
  '「仮取得済にする」をクリックすると、その学期の時間割の授業が取得済として扱われ、取得状況から残りの必要科目を確認できます。',
  '「まとめて教室を登録」→「登録」の順にクリックすると、その学期の時間割の教室が一括で登録されます。',
  '画面右上の「共有」をクリックします。',
  '「設定コードを生成する」を押し、QRコードのボタンをクリックします。',
  '表示されたQRコードをスマートフォンで読み取ります。',
  '上のようにはじめにアプリをホーム画面に追加するのがおすすめです。\n',
];

export function GuideContent({ index }: { index: number }) {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography variant="medium" sx={{ fontWeight: 'bold' }}>
        {titles[index]}
      </Typography>
      <Box
        component="img"
        src={images[index]}
        alt={`使い方${index + 1}`}
        sx={{ maxWidth: 640, mx: 1, mb: 1 }}
      />
      <Typography
        variant="x-small"
        sx={{ whiteSpace: 'pre-line', maxWidth: 630 }}
      >
        {descriptions[index]}
        {index === 13 && (
          <>
            画像はiphoneの方向けです。
            <Link
              href="https://curio-shiki.com/blog/smartphone/shortcut-on-home#toc1"
              target="_blank"
            >
              androidの方はこちら
            </Link>
          </>
        )}
      </Typography>
    </Box>
  );
}

function FirstTimeGuideModal() {
  const [isModalOpen, setIsModalOpen] = useFirstTimeGuideModal();

  const [index, setIndex] = useState(0);

  const handlePrev = () =>
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () =>
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <LargeModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 24,
          background: 'rgba(255,255,255,0.85)',
          borderRadius: 2,
          px: 1.5,
          py: 0.5,
          zIndex: 10,
        }}
      >
        <Typography variant="x-small" color="text.secondary">
          {index + 1} / {images.length}
        </Typography>
      </Box>

      <Box
        sx={{
          pt: { desktop: 13 },
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          alignItems: 'center',
        }}
      >
        <Stack direction="row" sx={{ width: '100%' }}>
          <Box
            onClick={handlePrev}
            sx={{
              flex: 1,
              mt: 4,
              height: 400,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              borderRadius: 2,
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' },
            }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 32 }} />
          </Box>
          <GuideContent index={index} />
          <Box
            onClick={handleNext}
            sx={{
              flex: 1,
              mt: 4,
              height: 400,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              borderRadius: 2,
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' },
            }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: 32 }} />
          </Box>
        </Stack>
      </Box>
    </LargeModal>
  );
}

export default memo(FirstTimeGuideModal);
