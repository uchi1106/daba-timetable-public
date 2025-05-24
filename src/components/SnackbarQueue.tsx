import {
  Alert,
  Box,
  Portal,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect } from 'react';

import { SnackbarMessage, useSnackbar } from '@/hooks/snackbar';

export const SnackbarQueue = () => {
  const theme = useTheme();
  const isLaptop = useMediaQuery(theme.breakpoints.up('laptop'));
  const { getSnackbarMessages, popSnackbarMessage } = useSnackbar();
  const messages: SnackbarMessage[] = getSnackbarMessages();

  useEffect(() => {
    const interval = setInterval(() => {
      popSnackbarMessage();
    }, 2000);
    return () => clearInterval(interval);
  }, [popSnackbarMessage]);

  return (
    <Portal container={() => document.body}>
      <Box
        sx={{
          position: 'fixed',
          display: 'flex',
          flexDirection: 'column',
          width: { mobile: '95%', laptop: 500 },
          bottom: { mobile: 60, laptop: 0 },
          left: 0,
          padding: { mobile: 0, laptop: 2 },
          gap: 1,
          zIndex: (theme) => theme.zIndex.modal + 1,
        }}
      >
        {messages.map((message, index) => (
          <Snackbar
            sx={{
              position: 'relative',
              width: '100%',
              zIndex: (theme) => theme.zIndex.modal + 1,
            }}
            key={index}
            open
            anchorOrigin={{
              vertical: isLaptop ? 'bottom' : 'top',
              horizontal: isLaptop ? 'left' : 'center',
            }}
          >
            <Alert
              sx={{
                width: '100%',
                alignItems: 'center',
              }}
              severity={message.state}
            >
              <Box
                sx={{
                  display: 'flex',
                  overflow: 'hidden',
                }}
              >
                <Typography
                  variant="x-small"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: 0,
                    flexShrink: 1,
                  }}
                >
                  {message.message.split('-')[0]}
                </Typography>
                <Typography
                  variant="x-small"
                  sx={{
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    marginLeft: 1,
                  }}
                >
                  {message.message.split('-')[1]}
                </Typography>
              </Box>
            </Alert>
          </Snackbar>
        ))}
      </Box>
    </Portal>
  );
};
