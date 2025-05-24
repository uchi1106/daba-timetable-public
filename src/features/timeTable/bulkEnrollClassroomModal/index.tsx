import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';

import { SmallModal } from '@/components/CustomModal';
import { useClassroom } from '@/hooks/classroom';
import { targetEnrolledTermAtom } from '@/hooks/term';
import { targetEnrolledYearAtom } from '@/hooks/year';

import { useBulkClassroomEnrollModal } from './hook';

export default function BulkClassroomEnrollModal() {
  const [isData, setIsData] = useBulkClassroomEnrollModal();
  const targetYear = useAtomValue(targetEnrolledYearAtom);
  const targetTerm = useAtomValue(targetEnrolledTermAtom);
  const { bulkEnrollClassroom } = useClassroom();
  return (
    <SmallModal open={!!isData} onClose={() => setIsData(null)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="x-small">
            {targetYear}年度{targetTerm}の時間割に登録されている授業に対して、
            他のユーザーによって最も多く登録されている教室を自動で割り当てます。
          </Typography>
          <Typography variant="x-small">
            既に教室が登録されている授業は上書きされません。また、他のユーザーによって教室が一度も登録されていない授業には教室は割り当てられません。
          </Typography>
        </Box>

        <ButtonGroup sx={{ display: 'flex', width: '100%' }}>
          <Button
            onClick={() => {
              setIsData(null);
            }}
            sx={{ width: '50%' }}
          >
            <Typography variant="xx-small">キャンセル</Typography>
          </Button>

          <Button
            disabled={isData === null || isData.length === 0}
            onClick={() => {
              if (isData === null || isData.length === 0) return;
              bulkEnrollClassroom(isData);
              setIsData(null);
            }}
            sx={{ width: '50%' }}
          >
            <Typography variant="xx-small">登録</Typography>
          </Button>
        </ButtonGroup>
      </Box>
    </SmallModal>
  );
}
