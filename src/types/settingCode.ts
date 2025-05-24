import { CourseIdAndClassroom } from './course';
import { FacultyRequirement } from './facultyRequirement';
import { TagToCourseNames } from './tagToCourseNames';

// inclusionModeがallの場合、 facultyRequirements, obtainedCourseIds, courseEnrolledYears, pastCoursesを全て設定する
// inclusionModeがfacultyRequirementsの場合、facultyRequirementsを設定する
export type SettingCode = {
  // どの情報を含めるか
  inclusionMode: 'all' | 'facultyRequirements';
  // 学部ごとの必要単位数・選択科目の情報
  facultyRequirements: FacultyRequirement[];
  // タグと授業名の対応
  tags: TagToCourseNames[];

  // 取得済みの授業コード
  obtainedCourseIds: string[];
  // 時間割に登録した年度とその授業の授業コード
  courseEnrolledYears: {
    course_id: string;
    enrolled_year: number;
  }[];
  // 過去の授業データ
  pastCourseIds: string[];
  // 教室
  classrooms?: CourseIdAndClassroom[];
};
