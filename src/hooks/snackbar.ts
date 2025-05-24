import { atom, useAtom } from 'jotai';

export interface SnackbarMessage {
  state: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export const messageAtom = atom<SnackbarMessage[]>([]);

export const useSnackbar = () => {
  const [snackbarMessages, setSnackbarMessages] = useAtom(messageAtom);

  const getSnackbarMessages = () => {
    return snackbarMessages;
  };

  const pushSnackbarMessage = (
    state: 'info' | 'success' | 'warning' | 'error',
    message: string
  ): void => {
    setSnackbarMessages((prevMessages) => {
      const newMessages =
        prevMessages.length >= 3
          ? [...prevMessages.slice(1), { state, message }]
          : [...prevMessages, { state, message }];
      return newMessages;
    });
  };

  const popSnackbarMessage = (): SnackbarMessage => {
    const message = snackbarMessages[0];
    setSnackbarMessages((prevMessages) => prevMessages.slice(1));
    return message;
  };

  return {
    getSnackbarMessages,
    pushSnackbarMessage,
    popSnackbarMessage,
  };
};
