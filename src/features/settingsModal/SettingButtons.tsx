import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

import { useResetConfirmModal } from './modal/resetSettingModal/hooks';

export const SettingButtons: React.FC = () => {
  const [, setResetConfirmModalData] = useResetConfirmModal();

  // 設定の削除メニューの管理
  const [resetMenuAnchor, setResetMenuAnchor] =
    useState<HTMLButtonElement | null>(null);

  // 現在の設定を表示する際に使用するデータを生成

  // メニューで選ばれたものに対応する情報の削除
  const resetMenuItemClick = (option: string) => {
    switch (option) {
      case 'all':
        setResetConfirmModalData({
          mode: 'setting',
          data: 'all',
        });
        break;
      case 'obtained':
        setResetConfirmModalData({
          mode: 'setting',
          data: 'obtained',
        });
        break;
      case 'fucultyRequirements':
        setResetConfirmModalData({
          mode: 'setting',
          data: 'fucultyRequirements',
        });

        // メニューを閉じる
        setResetMenuAnchor(null);
    }
  };
  return (
    <Box sx={{ display: 'flex', ml: 'auto' }}>
      {/* リセットメニューを開く */}
      <IconButton onClick={(e) => setResetMenuAnchor(e.currentTarget)}>
        <DeleteIcon />
      </IconButton>
      <Menu
        anchorEl={resetMenuAnchor}
        open={Boolean(resetMenuAnchor)}
        onClose={() => setResetMenuAnchor(null)}
      >
        <MenuItem onClick={() => resetMenuItemClick('all')}>
          <Typography variant="x-small">全ての情報</Typography>
        </MenuItem>
        <MenuItem onClick={() => resetMenuItemClick('obtained')}>
          <Typography variant="x-small">取得済みにした授業</Typography>
        </MenuItem>
        <MenuItem onClick={() => resetMenuItemClick('fucultyRequirements')}>
          <Typography variant="x-small">学部情報</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};
