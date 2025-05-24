import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { Grid } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useCourses } from '@/hooks/course';
import { useLocalStorageManagement } from '@/hooks/localStorageManagement';
import { useSnackbar } from '@/hooks/snackbar';
import { Course, CourseIdYearPair } from '@/types/course';

import { AddObtainedCoursesModalView } from '.';
import { getObtaindCourseIds } from './getObrainedCourses';
import { useAddObtainedCoursesModal } from './hook';

interface Props {
  obtainedCourseString: string;
  setView: Dispatch<SetStateAction<AddObtainedCoursesModalView>>;
}

export default function ConfirmRegistrationView({
  obtainedCourseString,
  setView,
}: Props) {
  const { pushSnackbarMessage } = useSnackbar();
  const { courses, setCourses, validateCourses } = useCourses();
  const {
    localFacultyRequirements,
    updateLocalObtainedCourseIds,
    updateLocalPastCourseIds,
    localCourseEnrolledYears,
    localClassrooms,
    localTags,
  } = useLocalStorageManagement();

  const requiredCourseNames: string[] = localFacultyRequirements.reduce(
    (accumRequiredCourseNames, facultyRequirement) => {
      accumRequiredCourseNames = [
        ...accumRequiredCourseNames,
        ...facultyRequirement.requiredCourseNames,
      ];
      return accumRequiredCourseNames;
    },
    [] as string[]
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [obtainedCourses, setObtainedCourses] = useState<Course[]>([]);
  const [localPastCourses, setlocalPastCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const courseIdYearPair: CourseIdYearPair[] =
        getObtaindCourseIds(obtainedCourseString);
      const { obtainedCourseIds, localPastCourses } =
        await validateCourses(courseIdYearPair);

      // ローカルにのみ登録されている授業を追加
      const allCourses = [...courses, ...localPastCourses];

      const newObtainedCourses: Course[] = obtainedCourseIds
        .map((obtainedCourseId) => {
          const obtainedCourse = allCourses.find(
            (course) => course.course_id === obtainedCourseId
          );
          return obtainedCourse;
        })
        // undefinedを除去 これによりcourse_idがallCoursesに存在しない場合スキップされる
        .filter((course): course is Course => course !== undefined);
      setObtainedCourses(newObtainedCourses);
      setlocalPastCourses(localPastCourses);
      setIsLoading(false);
    };

    fetchData();
  }, [obtainedCourseString, courses, validateCourses]);
  const [, setIsOpen] = useAddObtainedCoursesModal();

  const applyValidatedCourses = () => {
    // 取得済みの授業のcourse_id
    const obtainedCourseIds = obtainedCourses.map((course) => course.course_id);
    // TODO: 必修、タグ、教室を適用する処理について、useCoursesのapplyLocalCoursesChangeと機能が重複しているので、共通化する
    const findLocalEnrolledYear = (courseId: string) => {
      const localCourseEnrolledYear = localCourseEnrolledYears.find(
        (localCourseEnrolledYear) =>
          localCourseEnrolledYear.course_id === courseId
      );
      return localCourseEnrolledYear
        ? localCourseEnrolledYear.enrolled_year
        : null;
    };
    // 取得したlocalPastCoursesに対して、必修、タグ、教室を適用
    const updatedLocalPastCourses: Course[] = localPastCourses.map(
      (course) => ({
        ...course,
        required: requiredCourseNames.includes(course.course_name),
        enrolled_year: findLocalEnrolledYear(course.course_id),
        classroom:
          localClassrooms.find(
            (localClassroom) => localClassroom.course_id === course.course_id
          )?.classroom || null,
        tags: [
          ...course.tags,
          ...localTags
            .filter((tag) => tag.courseNames.includes(course.course_name))
            .map((tag) => tag.tagName),
        ],
      })
    );

    setCourses((prevCourses) => {
      // prevCoursesとupdatedLocalPastCoursesを結合し、念のためcourse_idが重複するものを除去
      const combinedCourses: Course[] = [
        ...prevCourses,
        ...updatedLocalPastCourses,
      ];
      const uniqueCourses: Course[] = Array.from(
        new Map(
          combinedCourses.map((course) => [course.course_id, course])
        ).values()
      );

      // 授業データに対して obtained フィールドを設定
      const newCourses = uniqueCourses.map((course) => ({
        ...course,
        obtained: obtainedCourseIds.includes(course.course_id),
      }));

      return newCourses;
    });

    // ローカルの値も更新;
    const localPastCoursesIds = localPastCourses.map(
      (course) => course.course_id
    );

    updateLocalPastCourseIds(localPastCoursesIds);
    updateLocalObtainedCourseIds(obtainedCourseIds);

    pushSnackbarMessage('success', '取得済みの授業の登録が完了しました');
    setIsOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            padding: 2,
          }}
        >
          <Typography variant="x-small">ロード中</Typography>
          <CircularProgress sx={{ margin: 2 }} size={40} />
        </Box>
      ) : (
        <Box
          sx={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="xx-small">
              以下の授業が過去の授業データとして個別に保存されます。最新の授業と重複する可能性があります。
            </Typography>

            <List sx={{ width: '100%' }}>
              <Grid container spacing={1}>
                {localPastCourses.map((course, index) => (
                  <Grid key={index}>
                    <ListItem
                      sx={{
                        py: 0,
                        px: 1,
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                      }}
                    >
                      <Typography noWrap variant="xx-small">
                        {course.course_id.slice(-4)}年度
                        {course.course_id} {course.course_name}
                      </Typography>
                    </ListItem>
                  </Grid>
                ))}
              </Grid>
            </List>
          </Box>

          {/* TODO: UI。授業を整列して表示する */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="xx-small">
              以下の授業が取得済みの授業として登録されます。
            </Typography>

            <List sx={{ width: '100%' }}>
              <Grid container spacing={1}>
                {obtainedCourses.map((course, index) => (
                  <Grid key={index}>
                    <ListItem
                      sx={{
                        py: 0,
                        px: 1,
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                      }}
                    >
                      <Typography noWrap variant="xx-small">
                        {course.course_id} {course.course_name}
                      </Typography>
                    </ListItem>
                  </Grid>
                ))}
              </Grid>
            </List>
          </Box>
        </Box>
      )}

      <ButtonGroup>
        <Button
          onClick={() => {
            setView('regist');
          }}
          sx={{ width: '50%' }}
        >
          <Typography variant="xx-small">登録画面に戻る</Typography>
        </Button>
        <Button
          onClick={() => {
            applyValidatedCourses();
            setView('regist');
            setIsOpen(false);
          }}
          disabled={isLoading}
          sx={{ width: '50%' }}
        >
          <Typography variant="xx-small">確定する</Typography>
        </Button>
      </ButtonGroup>
    </Box>
  );
}
