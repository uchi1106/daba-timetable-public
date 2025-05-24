import {
  Box,
  Button,
  Chip,
  Switch,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React, { useEffect } from 'react';

import {
  NotObtainedBadge,
  ObtainedBadge,
  RequiredBadge,
} from '@/components/CustomBadge';
import { LargeModal } from '@/components/CustomModal';
import { useClassroom } from '@/hooks/classroom';
import { useCourses } from '@/hooks/course';

import ClassroomControl from './ClassroomControl';
import EnrollYearControl from './EnrolledYearControl';
import { useCourseDetailModal } from './hook';

export const CourseDetailModal: React.FC = () => {
  // courseに値が入るとモーダルが開く
  const [courseData, setCourseData] = useCourseDetailModal();

  const { getClassroom } = useClassroom();

  const { updateCourse } = useCourses();

  const isLapTop = useMediaQuery((theme) => theme.breakpoints.up('laptop'));

  useEffect(() => {
    if (courseData) {
      getClassroom(courseData.course_id);
    }
  }, [courseData]);

  return (
    courseData && (
      <LargeModal open={!!courseData} onClose={() => setCourseData(null)}>
        <Box sx={{ display: 'flex', columngap: 1, alignItems: 'center' }}>
          {/* 授業コード・学部・授業名 */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
              <Typography variant="x-small">{courseData.faculty}</Typography>
              <Typography variant="x-small">{courseData.course_id}</Typography>
            </Box>
            <Typography variant="medium" sx={{ fontWeight: 'bold' }}>
              {courseData.course_name}
            </Typography>
          </Box>

          {/* 必修・取得済 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              ml: 'auto',
              columnGap: 0.5,
              justifyContent: 'right',
              height: courseData.enrolled_year ? '75%' : '100%',
            }}
          >
            {courseData.required && <RequiredBadge />}
            {courseData.obtained ? <ObtainedBadge /> : <NotObtainedBadge />}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            width: '100%',
            my: { mobile: 1, laptop: 2 },
            px: { mobile: 1.5, laptop: 3 },
            alignItems: 'center',
            flexDirection: { mobile: 'column', laptop: 'row-reverse' },
            rowGap: { mobile: 1, laptop: 0 },
            justifyContent: 'space-between',
          }}
        >
          {/* 時間割に登録している年度の設定 */}
          <EnrollYearControl
            courseData={courseData}
            setCourseData={setCourseData}
          />
          <Box
            sx={{
              display: 'flex',
              width: { mobile: '100%', laptop: '70%' },
              columnGap: { mobile: 3, laptop: 0 },
              justifyContent: 'space-between',
            }}
          >
            {/* 必修の設定 */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: isLapTop ? '100%' : '40%',
              }}
            >
              <Typography variant="x-small">必修</Typography>
              <Switch
                size={isLapTop ? 'medium' : 'small'}
                // スイッチを赤くするためにcolor="error"を指定
                color="error"
                sx={{ ml: isLapTop ? 3 : 'auto' }}
                checked={courseData.required}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const updatedCourse = {
                    ...courseData,
                    required: e.target.checked,
                  };
                  //モーダルの表示を更新
                  setCourseData(updatedCourse);
                  //全体のデータを更新
                  updateCourse(updatedCourse);
                }}
              />
            </Box>

            {/* 取得済の設定 */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: isLapTop ? '100%' : '40%',
              }}
            >
              <Typography variant="x-small">取得済</Typography>
              <Switch
                size={isLapTop ? 'medium' : 'small'}
                sx={{ ml: isLapTop ? 3 : 'auto' }}
                checked={courseData.obtained}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const updatedCourse = {
                    ...courseData,
                    obtained: e.target.checked,
                  };
                  //モーダルの表示を更新
                  setCourseData(updatedCourse);
                  //全体のデータを更新
                  updateCourse(updatedCourse);
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* 教室 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: { mobile: 1, laptop: 2 },
          }}
        >
          <ClassroomControl
            courseData={courseData}
            setCourseData={setCourseData}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: { mobile: 1, laptop: 2 },
          }}
        >
          <Box sx={{ display: 'flex' }}>
            {/* 教師名 */}
            <Box
              sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}
            >
              <Typography color="text.secondary" variant="xx-small">
                教師名
              </Typography>
              <Typography variant="x-small">{courseData.instructor}</Typography>
            </Box>

            {/* 時間割 */}
            <Box
              sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}
            >
              <Typography color="text.secondary" variant="xx-small">
                時間
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {courseData.dates?.map((date) => (
                  <Box
                    sx={{ display: 'flex' }}
                    key={date.day + date.period + date.term}
                  >
                    {date.term && date.day && date.period ? (
                      <Typography variant="x-small">
                        {`${date.term} ${date.day}曜日 ${date.period}コマ目`}
                      </Typography>
                    ) : date.term && date.day ? (
                      <Typography variant="x-small">{`${date.term} ${date.day}曜日`}</Typography>
                    ) : (
                      <Typography variant="x-small">{date.term}</Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex' }}>
            {/* 対象学年 */}
            <Box
              sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}
            >
              <Typography color="text.secondary" variant="xx-small">
                対象学年
              </Typography>
              <Typography variant="x-small">
                {courseData.required_grade}年次～
              </Typography>
            </Box>
            {/* 単位数 */}
            <Box
              sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}
            >
              <Typography color="text.secondary" variant="xx-small">
                単位数
              </Typography>
              <Typography variant="x-small">{`${courseData.credits}単位`}</Typography>
            </Box>
          </Box>

          {/* タグ */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography color="text.secondary" variant="xx-small">
              タグ
            </Typography>
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  gap: 1,
                }}
              >
                {courseData.tags.map((tag) => (
                  <Chip
                    sx={{
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
            </Box>
          </Box>

          {/* 授業概要 */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography color="text.secondary" variant="xx-small">
              授業概要
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mx: { mobile: 0.5, laptop: 0 },
              }}
            >
              {/* \nごとに改行 */}
              {courseData.course_outline?.split('\n').map((line, index) => (
                <Typography variant="xx-small" key={index}>
                  {line}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* 評価基準 */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography color="text.secondary" variant="xx-small">
              評価基準
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mx: { mobile: 0.5, laptop: 0 },
              }}
            >
              {/* \nごとに改行 */}
              {courseData.evaluation_criteria
                ?.split('\n')
                .map((line, index) => (
                  <Typography variant="xx-small" key={index}>
                    {line}
                  </Typography>
                ))}
            </Box>
          </Box>
        </Box>

        {/* シラバスへのリンク */}
        {courseData.url && (
          <Button
            href={courseData.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              mt: { mobile: 'auto', laptop: 4 },
              display: 'flex',
              alignSelf: 'flex-end',
              justifySelf: 'flex-end',
              p: 0,
            }}
          >
            <Typography variant="x-small">教務システムで詳細を確認</Typography>
          </Button>
        )}
      </LargeModal>
    )
  );
};
