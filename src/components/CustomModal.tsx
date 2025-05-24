import { Box, Modal } from '@mui/material';

type modalSize = 'small' | 'medium' | 'large';

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  size: modalSize;
  children: React.ReactNode;
}
const CustomModal: React.FC<ModalProps> = ({
  open,
  onClose,
  size,
  children,
}) => {
  return (
    // TODO: heightを設定する
    <Modal open={open} onClose={onClose}>
      {/* はいかいいえを問うような小さいモーダル */}
      {size === 'small' ? (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { mobile: '90%', laptop: 600 },
            height: { mobile: 200, laptop: 250 },
            maxHeight: '60dvh',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            borderRadius: '5px',
            boxShadow: 24,
            p: 3,
            overflowY: 'auto',
          }}
        >
          {children}
        </Box>
      ) : // １つの入力ボックスに対する入力などがある中くらいのモーダル
      size === 'medium' ? (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { mobile: '85%', laptop: 800 },
            height: { mobile: '85%', laptop: 600 },
            maxHeight: '70dvh',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            borderRadius: '5px',
            boxShadow: 24,
            p: { mobile: 2, laptop: 3 },
            overflowY: 'auto',
          }}
        >
          {children}
        </Box>
      ) : (
        // 情報の一覧表示や複数の情報の入力を目的とした大きいモーダル
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { mobile: '95%', laptop: 1000 },
            height: { mobile: '95%', laptop: 800 },
            maxHeight: '80dvh',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            borderRadius: '5px',
            boxShadow: 24,
            p: { mobile: 1.5, laptop: 3 },
            overflowY: 'auto',
          }}
        >
          {children}
        </Box>
      )}
    </Modal>
  );
};

type CustomModalProps = {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
};

export const SmallModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  children,
}) => {
  return (
    <CustomModal size="small" open={open} onClose={onClose}>
      {children}
    </CustomModal>
  );
};

export const MediumModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  children,
}) => {
  return (
    <CustomModal size="medium" open={open} onClose={onClose}>
      {children}
    </CustomModal>
  );
};

export const LargeModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  children,
}) => {
  return (
    <CustomModal size="large" open={open} onClose={onClose}>
      {children}
    </CustomModal>
  );
};
