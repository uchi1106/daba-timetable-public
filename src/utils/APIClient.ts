import { Course, CourseIdAndClassroom, CourseIdYearPair } from '@/types/course';

export type ValidateCoursesResult = {
  obtainedCourseIds: string[];
  localPastCourses: Course[];
};

// APIClient.ts
export class APIClient {
  private baseUrl: string;

  constructor() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;
    console.log('API Base URL:', baseUrl);
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
    }
    this.baseUrl = baseUrl;
  }

  private async fetchJson<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}/api/${endpoint}`;
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      console.log(
        `API call failed: ${endpoint}, Status: ${response.status}, Error: ${errorText}`
      );
      throw new Error(
        `API call failed: ${endpoint}, Status: ${response.status}, Error: ${errorText}`
      );
    }
    return await response.json();
  }

  async fetchCourses(
    faculties: string[],
    pastCourseIds: string[]
  ): Promise<Course[]> {
    return this.fetchJson<Course[]>(
      'courses?faculties=' +
        faculties.join(',') +
        '&pastCourseIds=' +
        pastCourseIds.join(',')
    );
  }

  async validateCourses(
    courseIdYearPairs: CourseIdYearPair[]
  ): Promise<ValidateCoursesResult> {
    return this.fetchJson<{
      obtainedCourseIds: string[];
      localPastCourses: Course[];
    }>('courses_validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseIdYearPairs }),
    });
  }

  async enrollClassroom(
    courseIdAndClassroom: CourseIdAndClassroom
  ): Promise<{ status: string }> {
    console.log(courseIdAndClassroom);
    return this.fetchJson<{ status: string }>('classroom/enroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseIdAndClassroom }),
    });
  }

  async bulkEnrollClassroom(
    courseIds: string[]
  ): Promise<CourseIdAndClassroom[]> {
    return this.fetchJson<CourseIdAndClassroom[]>('classroom/bulk_enroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseIds }),
    });
  }

  async getClassroom(courseId: string): Promise<string[]> {
    return this.fetchJson<string[]>(`classroom/get?courseId=${courseId}`);
  }

  // 取得した長い設定コードを返す
  async getLongSettingCode(code: string): Promise<string> {
    return this.fetchJson<string>(`setting_code/${code}`);
  }

  // バックエンドで設定したユーザに表示する短い設定コードを返す
  async addSettingCode(longCode: string, isOneUse: boolean): Promise<string> {
    return this.fetchJson<string>(`setting_code/add`, {
      method: 'POST',
      body: JSON.stringify({ longCode: longCode, isOneUse: isOneUse }),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
