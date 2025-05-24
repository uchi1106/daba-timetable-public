import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Chip,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { LargeModal } from '@/components/CustomModal';
import { useCourses } from '@/hooks/course';
import { useFacultyRequirements } from '@/hooks/facultyRequirement';
import { useLocalStorageManagement } from '@/hooks/localStorageManagement';
import { useSnackbar } from '@/hooks/snackbar';
import { TagToCourseNames } from '@/types/tagToCourseNames';

import { useTagToCoursesModal } from './hooks';

export default function TagToCoursesModal() {
  const { pushSnackbarMessage } = useSnackbar();
  const [isOpen, setIsOpen] = useTagToCoursesModal();

  const { courses, setCourses } = useCourses();
  const { facultyRequirements } = useFacultyRequirements();

  const initialUsingTags: string[] = [];

  facultyRequirements.map((facultyRequirement) => {
    facultyRequirement.electiveRequirements.map((electiveRequirement) => {
      initialUsingTags.push(...electiveRequirement.tags);
    });
  });

  const usingTags = Array.from(new Set(initialUsingTags));

  const { localTags, updateLocalTags } = useLocalStorageManagement();

  // 編集するタグの情報を保持
  const [editTags, setEditTags] = useState<
    (TagToCourseNames & { inputCourseName: string })[]
  >([]);

  const [newTagName, setNewTagName] = useState<string>('');

  useEffect(() => {
    setEditTags(
      localTags.map((tag) => ({
        ...tag,
        inputCourseName: '',
      }))
    );
  }, [localTags]);

  const addTag = (newTag: TagToCourseNames & { inputCourseName: string }) => {
    if (editTags.some((tag) => tag.tagName === newTag.tagName)) {
      pushSnackbarMessage('error', '同じタグが既に存在します');
    } else {
      setEditTags((prevTags) => [...prevTags, newTag]);
    }
  };

  const deleteTag = (tagName: string) => {
    setEditTags((prevTags) =>
      prevTags.filter((tag) => tag.tagName !== tagName)
    );
  };

  const handleEnrollment = () => {
    setCourses((prevCourses) => {
      const newCourses = prevCourses.map((course) => {
        // localTagsが含まれる前の授業のタグを取得
        const newTags = course.tags.filter(
          (tag) => !localTags.some((localTag) => localTag.tagName === tag)
        );

        // localTagsが含まれる授業のタグを取得して追加
        editTags.map((tag) => {
          if (tag.courseNames.includes(course.course_name)) {
            newTags.push(tag.tagName);
          }
        });
        return { ...course, tags: newTags };
      });
      return newCourses;
    });

    updateLocalTags(
      editTags.map((tag) => ({
        tagName: tag.tagName,
        courseNames: tag.courseNames,
      }))
    );
    pushSnackbarMessage('success', 'タグの設定が完了しました');
    setIsOpen(false);
  };

  return (
    <LargeModal open={isOpen} onClose={() => setIsOpen(false)}>
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
            タグ名を追加すると、授業名に応じて授業にタグを付けることができます。
          </Typography>

          <Typography variant="x-small">
            選択必修の登録で使用しているタグは削除できません。
          </Typography>

          <Box sx={{ display: 'flex', mb: 1 }}>
            <TextField
              sx={{ width: '60%', mr: 1 }}
              label="新しいタグ名"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
            />

            <Button
              onClick={() => {
                addTag({
                  tagName: newTagName,
                  courseNames: [],
                  inputCourseName: '',
                });
                setNewTagName('');
              }}
              disabled={!newTagName}
            >
              <Typography>タグを追加</Typography>
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            rowGap: 2,
          }}
        >
          {editTags.map((tag, index) => {
            return (
              <Box
                key={index}
                sx={{ border: '1px solid', borderRadius: '4px', p: 1 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>{tag.tagName}</Typography>
                  <Button
                    disabled={usingTags.includes(tag.tagName)}
                    onClick={() => deleteTag(tag.tagName)}
                  >
                    <Typography>削除</Typography>
                  </Button>
                </Box>
                <Box>
                  {/* チップで選択済みコース表示 */}
                  <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}
                  >
                    {tag.courseNames.map((courseName, courseIndex) => (
                      <Chip
                        key={courseIndex}
                        label={courseName}
                        onDelete={() =>
                          setEditTags((prevTags) =>
                            prevTags.map((prevTag) =>
                              prevTag.tagName === tag.tagName
                                ? {
                                    ...prevTag,
                                    courseNames: prevTag.courseNames.filter(
                                      (name) => name !== courseName
                                    ),
                                  }
                                : prevTag
                            )
                          )
                        }
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    <Autocomplete
                      sx={{ width: '70%' }}
                      clearOnBlur={false}
                      multiple
                      options={Array.from(
                        new Set(courses.map((course) => course.course_name))
                      )}
                      inputValue={tag.inputCourseName}
                      renderInput={(params) => (
                        <TextField {...params} label="授業名" />
                      )}
                      onInputChange={(_event, newInputValue) => {
                        setEditTags((prevTags) =>
                          prevTags.map((prevTag) =>
                            prevTag.tagName === tag.tagName
                              ? { ...prevTag, inputCourseName: newInputValue }
                              : prevTag
                          )
                        );
                      }}
                      onChange={(_event, newValue) => {
                        if (!newValue) return;
                        else {
                          setEditTags((prevTags) => {
                            const updatedTags = prevTags.map((prevTag) => {
                              if (prevTag.tagName === tag.tagName) {
                                return {
                                  ...prevTag,
                                  courseNames: Array.from(
                                    new Set([
                                      ...prevTag.courseNames,
                                      ...newValue,
                                    ])
                                  ),
                                  inputCourseName: '', // 入力ボックスをリセット
                                };
                              } else {
                                return prevTag;
                              }
                            });
                            return updatedTags;
                          });
                        }
                      }}
                    />

                    <Button
                      variant="outlined"
                      disabled={!tag.inputCourseName.trim()}
                      sx={{ width: '30%', ml: 1 }}
                      onClick={() => {
                        setEditTags((prevTags) => {
                          const updatedTags = prevTags.map((prevTag) => {
                            if (prevTag.tagName === tag.tagName) {
                              return {
                                ...prevTag,
                                courseNames: Array.from(
                                  new Set([
                                    ...prevTag.courseNames,
                                    tag.inputCourseName,
                                  ])
                                ),
                                inputCourseName: '', // 入力ボックスをリセット
                              };
                            } else {
                              return prevTag;
                            }
                          });
                          return updatedTags;
                        });
                      }}
                    >
                      <Typography variant="x-small">
                        リストにない授業名を追加
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <ButtonGroup sx={{ mt: 1 }}>
            <Button
              onClick={() => {
                setIsOpen(false);
                setEditTags(
                  localTags.map((tag) => ({ ...tag, inputCourseName: '' }))
                );
              }}
              sx={{ width: '50%' }}
            >
              キャンセル
            </Button>
            <Button
              onClick={() => {
                handleEnrollment();
              }}
              sx={{ width: '50%' }}
            >
              保存
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
    </LargeModal>
  );
}
