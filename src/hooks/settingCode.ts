import { atom, useAtom } from 'jotai';
import pako from 'pako';
import { SetStateAction, useCallback } from 'react';

import { SettingCode } from '@/types/settingCode';

import { useAPI } from './client';
import { useLocalStorageManagement } from './localStorageManagement';
import { useSnackbar } from './snackbar';

interface UseSettingCodeResult {
  code: string | null;
  setCode: (code: SetStateAction<string | null>) => void;
  longCode: string | null;
  setLongCode: (code: SetStateAction<string | null>) => void;
  fetchSettingCode: (code: string) => void;
  addSettingCode: (settingCode: SettingCode) => void;
}

const codeAtom = atom<string | null>(null);

const longCodeAtom = atom<string | null>(null);

export const useSettingCode = (): UseSettingCodeResult => {
  const api = useAPI();

  const { pushSnackbarMessage } = useSnackbar();

  // エラーにより取得できなかった場合はnull、そもそも行が存在しない場合は‘’を返す
  const [code, setCode] = useAtom(codeAtom);
  const [longCode, setLongCode] = useAtom(longCodeAtom);

  const { updateLocalStorages } = useLocalStorageManagement();

  const fetchSettingCode = useCallback(
    async (code: string) => {
      setLongCode(null);
      try {
        const longCode: string = await api.getLongSettingCode(code);
        if (longCode === '') {
          pushSnackbarMessage('error', '使用可能な設定コードを入力して下さい');
          return;
        }
        const decompressed = pako.ungzip(Buffer.from(longCode, 'base64'));
        const jsonStringData = new TextDecoder().decode(decompressed);

        // JSON文字列をパース
        const settingCode: SettingCode = JSON.parse(jsonStringData);
        const {
          inclusionMode,
          facultyRequirements,
          tags = [],
          obtainedCourseIds,
          courseEnrolledYears,
          pastCourseIds,
          classrooms = [],
        } = settingCode;

        // いらない？？TODO:
        setLongCode(longCode);

        // ローカルストレージに情報を保存
        switch (inclusionMode) {
          case 'all':
            updateLocalStorages(
              facultyRequirements,
              tags,
              obtainedCourseIds,
              courseEnrolledYears,
              pastCourseIds,
              classrooms
            );
            break;
          case 'facultyRequirements':
            updateLocalStorages(facultyRequirements, tags);
            break;
          default:
            break;
        }
        window.location.reload(); // ページをリロードしてローカルストレージに保存された情報を反映する
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        // エラー処理を追加（例：エラー状態の設定、ユーザーへの通知など）
      }
      // TODO: 依存配列を変更せずにワーニングが出ないようにする
      return false;
    },
    [api]
  );

  const addSettingCode = useCallback(
    async (settingCode: SettingCode) => {
      setCode(null);
      // JSON文字列に変換
      const jsonStringData = JSON.stringify(settingCode);
      // 圧縮
      const compressed = pako.gzip(jsonStringData);
      // base64エンコード
      const encodedSettingCode = Buffer.from(compressed).toString('base64');
      try {
        const code: string = await api.addSettingCode(
          encodedSettingCode,
          // settingCode.inclusionModeがfacultyRequirementsのときはisOneUseをtrueにする
          settingCode.inclusionMode === 'all'
        );

        // 短い設定コードを全体に共有するために保存
        setCode(code);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        // エラー処理を追加（例：エラー状態の設定、ユーザーへの通知など）
      }
    },
    [api]
  );

  return {
    code,
    setCode,
    longCode,
    setLongCode,
    fetchSettingCode,
    addSettingCode,
  };
};
