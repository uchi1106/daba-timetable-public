import { Box, Input, useMediaQuery, useTheme } from '@mui/material';
import React, { Dispatch, ReactNode, SetStateAction, useRef } from 'react';

type CodeInputProps = (length: number) => (
  input: string[],
  setInput: Dispatch<SetStateAction<string[]>>
) => {
  isValidInputCode: (chars: string[]) => boolean;
  render: () => ReactNode;
};

export const useCodeInput: CodeInputProps = (length) => {
  const theme = useTheme();
  const isLapTop = useMediaQuery(theme.breakpoints.up('laptop'));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isValidInputCode = (chars: string[]) => {
    const checkChar = (char: string) => {
      if (char.length === 1) {
        return true;
      }
      return false;
    };

    const checkChars = (chars: string[]) => {
      let isValid = true;
      chars.forEach((char) => {
        if (!checkChar(char)) {
          isValid = false;
        }
      });
      return isValid;
    };

    if (chars.length === 4 && checkChars(chars)) {
      return true;
    }
    return false;
  };

  return (input, setInput) => {
    const render = () => {
      const handleChange = (value: string, index: number) => {
        if (!/^[0-9a-zA-Z-_]?$/.test(value)) return; // ← 数字と英字のみ許容（必要に応じて調整）

        const updated = [...input];
        updated[index] = value;
        setInput(updated);

        if (value && index < length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
      };

      const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 4);
        const newInputs = [...input];

        pasteData.split('').forEach((char, index) => {
          if (index < length) {
            newInputs[index] = char;
          }
        });

        setInput(newInputs);
        inputRefs.current[Math.min(pasteData.length - 1, length - 1)]?.focus();
      };

      const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number
      ) => {
        const inputEvent = e as React.KeyboardEvent<HTMLInputElement>;
        if (inputEvent.key === 'Backspace' && !input[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      };

      const handleContainerMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const lastFilledIndex = input.reduce(
          (prev, curr, index) => (curr ? index : prev),
          -1
        );

        let targetIndex = 0;
        if (lastFilledIndex !== -1) {
          targetIndex = Math.min(lastFilledIndex + 1, length - 1);
        }

        inputRefs.current[targetIndex]?.focus();
      };

      return (
        <Box
          sx={{ display: 'flex', flexDirection: 'row' }}
          onMouseDown={handleContainerMouseDown}
        >
          {Array.from({ length }).map((_, index) => (
            <Input
              key={index}
              inputRef={(el) => (inputRefs.current[index] = el)}
              sx={{ border: 1, mx: 0.5, width: isLapTop ? 40 : 25 }}
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: 'center',
                  fontSize: isLapTop ? '1.5rem' : '1rem',
                },
              }}
              value={input[index] ?? ``}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
            />
          ))}
        </Box>
      );
    };

    return { isValidInputCode, render };
  };
};
