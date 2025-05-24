export type Course = {
  course_id: string; // 時間割コード 基礎情報として先に取得
  numbering: string; // ナンバリング
  faculty: string; // 学部 基礎情報として先に取得
  course_name: string; // 科目名 基礎情報として先に取得
  dates: Date[];
  instructor: string | null; // 担当教員 基礎情報として先に取得
  required_grade: number; // 対象年次 基礎情報として先に取得
  credits: number; // 単位数 基礎情報として取得
  tags: string[]; // タグ 基礎情報として取得
  course_outline: string | null; // 授業概要
  evaluation_criteria: string | null; // 授業評価基準
  url: string; // URL,
  required: boolean; // 必修かどうか
  obtained: boolean;
  enrolled_year: number | null;
  classroom: string | null; // 教室
};

export type Term = '前期' | '後期';

export type Date = {
  term: Term; // 開講期 基礎情報として先に取得
  day: string; // 曜日 基礎情報として先に取得
  period: number[]; // コマ 基礎情報として先に取得
};

// course_idとその授業がある年のペア
export type CourseIdYearPair = {
  course_id: string;
  year: number;
};

// course_idとその授業を時間割に登録している年のペア
export type CourseIdAndEnrolledYear = {
  course_id: string;
  enrolled_year: number;
};

// course_idとその授業の教室のペア
export type CourseIdAndClassroom = {
  course_id: string;
  classroom: string;
};
