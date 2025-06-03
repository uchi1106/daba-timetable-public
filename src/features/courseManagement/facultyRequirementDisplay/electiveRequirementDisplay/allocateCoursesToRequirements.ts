import { Course } from '@/types/course';
import { ElectiveRequirement } from '@/types/facultyRequirement';

export type AllocateCoursesInfo = {
  [key: string]: {
    obtainedCredits: number;
    displayedCourses: Course[];
  };
};

// タグの設定がされていないElectiveRequirementがある場合にallocateCoursesInfoを設定するために使用。条件を満たすために不必要なcourseを余らせる。
const allocateMinimalCourses = (
  electiveRequirement: ElectiveRequirement,
  visitedElectiveRequirementsIds: string[],
  filteredcourses: Course[],
  allocateCoursesInfo: AllocateCoursesInfo,
  graph: { [key: string]: ElectiveRequirement[] }
) => {
  // 既に訪れたElectiveRequirementを追加
  visitedElectiveRequirementsIds = [
    ...visitedElectiveRequirementsIds,
    electiveRequirement.electiveRequirementId,
  ];

  // ElectiveRequirementのタグに該当するコースを抽出
  const targetCourses = filteredcourses.filter((course) =>
    course.tags.some((tag) => electiveRequirement.tags.includes(tag))
  );

  // 必修のcourseを抽出
  const requiredCourses = targetCourses.filter(
    (course) => course.required === true
  );

  // 表示するcourseを保持するための配列
  const displayedCourses: Course[] = [...requiredCourses];

  // 取得済みのcourseを抽出（必修のものを除く）
  const obtainedCourses = targetCourses.filter(
    (course) => course.obtained === true && course.required !== true
  );

  // 下の階層のElectiveRequirementを検索（下の階層がなければ空配列）
  const attributeElectiveRequirements =
    graph[electiveRequirement.electiveRequirementId];

  // 下の階層のElectiveRequirementの取得済み単位数を取得
  const totalObtainedCreditsInChildren: number =
    attributeElectiveRequirements.reduce(
      (sum, electiveRequirement) =>
        sum +
        allocateCoursesInfo[electiveRequirement.electiveRequirementId]
          .obtainedCredits,
      0
    );

  // 下の階層のElectiveRequirementの表示される単位数を取得
  const totalDisplayedCreditsInChildren: number =
    attributeElectiveRequirements.reduce(
      (sum, electiveRequirement) => sum + electiveRequirement.credits,
      0
    );

  // 取得済みのcourseの単位数
  let obtainedCoursesCredits: number = totalObtainedCreditsInChildren;

  // 必修のcourseの単位数
  const requiredCourseCredits = requiredCourses.reduce((sum, course) => {
    if (course.obtained === true) {
      obtainedCoursesCredits += course.credits;
    }
    return sum + course.credits;
  }, 0);

  // 表示するcourseの単位数
  obtainedCourses.reduce((sum, course) => {
    if (sum < electiveRequirement.credits) {
      displayedCourses.push(course);
      obtainedCoursesCredits = obtainedCoursesCredits + course.credits;
      return sum + course.credits;
    }
    return sum;
  }, requiredCourseCredits + totalDisplayedCreditsInChildren);

  // 表示するcourseのIDのリストを取得（表示するcourseの除外に使用）
  const displayedCoursesIds = displayedCourses.map(
    (course) => course.course_id
  );

  // 表示するcourseを除外
  filteredcourses = filteredcourses.filter(
    (course) => !displayedCoursesIds.includes(course.course_id)
  );

  // AllocateCoursesInfoに情報を追加
  allocateCoursesInfo[electiveRequirement.electiveRequirementId] = {
    obtainedCredits: obtainedCoursesCredits,
    displayedCourses: displayedCourses,
  };

  return {
    visitedElectiveRequirementsIds,
    filteredcourses,
    allocateCoursesInfo,
  };
};

// タグの設定がされていないElectiveRequirementが存在しない場合にallocateCoursesInfoを設定するために使用。条件を満たしていてもcourseを割りあてる。
const allocateAllCourses = (
  electiveRequirement: ElectiveRequirement,
  courses: Course[],
  allocateCoursesInfo: AllocateCoursesInfo,
  graph: { [key: string]: ElectiveRequirement[] }
): AllocateCoursesInfo => {
  // 加える対象となるcourseを取得
  const targetCourses = courses.filter(
    (course) =>
      course.tags.some((tag) => electiveRequirement.tags.includes(tag)) &&
      (course.obtained || course.required)
  );

  const attributeElectiveRequirementTags: string[] = Array.isArray(
    graph[electiveRequirement.electiveRequirementId]
  )
    ? graph[electiveRequirement.electiveRequirementId].reduce(
        (
          accTags: string[],
          currentElectiveRequirement: ElectiveRequirement
        ) => {
          return [...accTags, ...currentElectiveRequirement.tags];
        },
        []
      )
    : [];

  const displayedCourses = targetCourses
    .filter(
      (course) =>
        !course.tags.some((tag) =>
          attributeElectiveRequirementTags.includes(tag)
        )
    )
    .sort((course_a, course_b) =>
      course_a.obtained === false && course_b.obtained === true ? 1 : -1
    );

  // 取得済みの単位数を計算
  const obtainedCourseCredits = targetCourses
    .filter((course) => course.obtained === true)
    .reduce((sum, course) => sum + course.credits, 0);

  // AllocateCoursesInfoに情報を追加
  allocateCoursesInfo[electiveRequirement.electiveRequirementId] = {
    obtainedCredits: obtainedCourseCredits,
    displayedCourses: displayedCourses,
  };

  {
    graph[electiveRequirement.electiveRequirementId].forEach(
      (electiveRequirement) => {
        allocateAllCourses(
          electiveRequirement,
          courses,
          allocateCoursesInfo,
          graph
        );
      }
    );
  }

  return allocateCoursesInfo;
};

export const allocateCoursesToRequirements = (
  electiveRequirements: ElectiveRequirement[],
  courses: Course[],
  graph: { [key: string]: ElectiveRequirement[] }
): AllocateCoursesInfo => {
  let allocateCoursesInfo: AllocateCoursesInfo = {};

  // タグの設定がされていないelectiveRequirementがある場合
  if (
    electiveRequirements.find(
      (electiveRequirement) => electiveRequirement.tags.length === 0
    )
  ) {
    // タグの設定がされていないElectiveRequirementを取得（１つのみ！）
    const noTagElectiveRequirement: ElectiveRequirement =
      electiveRequirements.find(
        (electiveRequirement) => electiveRequirement.tags.length === 0
      )!;

    // タグの設定がされているElectiveRequirement
    const tagElectiveRequirements: ElectiveRequirement[] =
      electiveRequirements.filter(
        (electiveRequirement) => electiveRequirement.tags.length !== 0
      );

    // 既に訪れたElectiveRequirementのIDを保持
    let visitedElectiveRequirementsIds: string[] = [];

    let filteredcourses: Course[] = courses;

    // タグの設定がされているElectiveRequirementを全て訪れる
    while (
      visitedElectiveRequirementsIds.length < tagElectiveRequirements.length
    ) {
      // 初回
      if (visitedElectiveRequirementsIds.length === 0) {
        // 下層にElectiveRequirementがないElectiveRequirementを取得
        const targetElectiveRequirements = tagElectiveRequirements.filter(
          (electiveRequirement) =>
            graph[electiveRequirement.electiveRequirementId].length === 0
        );

        // 下層にElectiveRequirementがないElectiveRequirementを訪れる
        targetElectiveRequirements.forEach((electiveRequirement) => {
          ({
            visitedElectiveRequirementsIds,
            filteredcourses,
            allocateCoursesInfo,
          } = allocateMinimalCourses(
            electiveRequirement,
            visitedElectiveRequirementsIds,
            filteredcourses,
            allocateCoursesInfo,
            graph
          ));
        });
      } else {
        // 下層にElectiveRequirementがないElectiveRequirementを取得
        const targetElectiveRequirementIds: string[] = Object.entries(graph)
          .filter(
            ([key, requirements]) =>
              !visitedElectiveRequirementsIds.includes(key) &&
              requirements.every((req) =>
                visitedElectiveRequirementsIds.includes(
                  req.electiveRequirementId
                )
              )
          )
          .map(([key]) => key);

        const targetElectiveRequirements = tagElectiveRequirements.filter(
          (electiveRequirement) =>
            targetElectiveRequirementIds.includes(
              electiveRequirement.electiveRequirementId
            )
        );

        targetElectiveRequirements.forEach((electiveRequirement) => {
          ({
            visitedElectiveRequirementsIds,
            filteredcourses,
            allocateCoursesInfo,
          } = allocateMinimalCourses(
            electiveRequirement,
            visitedElectiveRequirementsIds,
            filteredcourses,
            allocateCoursesInfo,
            graph
          ));
        });
      }
    }

    // 他のElectiveRequirementで余ったcourseをタグが設定されていないElectiveRequirementに追加
    const noTagElectiveRequirementCourse: Course[] = filteredcourses.filter(
      (course) => course.required === true || course.obtained === true
    );

    // 取得済みの授業の単位数を計算
    const noTagElectiveRequirementCourseCredits = noTagElectiveRequirementCourse
      .filter((course) => course.obtained === true)
      .reduce((sum, course) => sum + course.credits, 0);

    allocateCoursesInfo[noTagElectiveRequirement.electiveRequirementId] = {
      obtainedCredits: noTagElectiveRequirementCourseCredits,
      displayedCourses: noTagElectiveRequirementCourse,
    };
    // タグの設定がされていないelectiveRequirementがない場合
  } else {
    // 上位要件のみを取得
    const topElectiveRequirements = electiveRequirements.filter(
      (electiveRequirement) =>
        electiveRequirement.upperElectiveRequirementId === null
    );
    // 上位要件のみを訪れる
    topElectiveRequirements.forEach((electiveRequirement) => {
      allocateCoursesInfo = allocateAllCourses(
        electiveRequirement,
        courses,
        allocateCoursesInfo,
        graph
      );
    });
  }
  return allocateCoursesInfo;
};
