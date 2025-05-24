import { useMediaQuery } from '@mui/material';
import { green } from '@mui/material/colors';
import { styled, useTheme } from '@mui/material/styles';
import React from 'react';

const BadgeWrapper = styled('span')<{ backgroundColor?: string }>(({
  theme,
  backgroundColor,
}) => {
  const customTheme = useTheme();
  const isMobile = useMediaQuery(customTheme.breakpoints.up('mobile'));
  const isLaptop = useMediaQuery(customTheme.breakpoints.up('laptop'));
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: backgroundColor || green[600],
    color: theme.palette.getContrastText(backgroundColor || green[600]),
    borderRadius: '16px',
    padding: '0px 10px',

    fontWeight: 'bold',
    whiteSpace: 'nowrap',

    ...(isMobile && {
      fontSize: 8,
      paddingTop: '0.5px',
    }),

    ...(isLaptop && {
      fontSize: 13,
      paddingTop: '1px',
    }),
  };
});

interface EnrollYearBadgeProps {
  year: number;
  backgroundColor?: string;
}

export const EnrollYearBadge: React.FC<EnrollYearBadgeProps> = ({
  year,
  backgroundColor = green[600],
}) => {
  return (
    <BadgeWrapper backgroundColor={backgroundColor}>
      登録: {year}年
    </BadgeWrapper>
  );
};
