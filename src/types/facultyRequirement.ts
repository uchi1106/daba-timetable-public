export type ElectiveRequirement = {
  electiveRequirementId: string;
  tags: string[];
  upperElectiveRequirementId: string | null;
  credits: number;
};

export type FacultyRequirement = {
  facultyRequirementId: string | null; //例 2023情報学部計算機プログラム
  facultyName: string; //学部名
  credits: number | null; //その学部からあと何単位とる必要があるか
  requiredCourseNames: string[]; // 必修 course_idのリストを想定
  electiveRequirements: ElectiveRequirement[];
};
