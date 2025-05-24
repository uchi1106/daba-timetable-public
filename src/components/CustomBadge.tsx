import { useMediaQuery } from '@mui/material';
import { blue, grey, red } from '@mui/material/colors';
import { styled, useTheme } from '@mui/material/styles';
import React from 'react';

// TODO: レスポンシブに対応する。微調整
const CustomBadge = styled('span')<{
  backgroundColor?: string;
  height?: {
    mobile?: string;
    tablet?: string;
    laptop?: string;
    desktop?: string;
  };
  paddingTop?: {
    mobile?: string;
    tablet?: string;
    laptop?: string;
    desktop?: string;
  };
}>(({ theme, backgroundColor, height, paddingTop }) => {
  const customTheme = useTheme();
  const isMobile = useMediaQuery(customTheme.breakpoints.up('mobile'));
  const isLaptop = useMediaQuery(customTheme.breakpoints.up('laptop'));

  return {
    display: 'inline-flex',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: backgroundColor || theme.palette.primary.main,
    color: 'white',
    transform: 'rotate(5deg)',
    fontWeight: 'bold',

    ...(isMobile && {
      width: '32px',
      height: height?.mobile,
      paddingTop: paddingTop?.mobile,
      fontSize: '21px',
    }),

    ...(isLaptop && {
      width: '48px',
      height: height?.laptop,
      paddingTop: paddingTop?.laptop,
      fontSize: '32px',
    }),
    // isLaptopを適応するためisDesktopは作らない
  };
});

interface CustomBadgeProps {
  char?: string;
  backgroundColor?: string;
  height?: {
    mobile?: string;
    tablet?: string;
    laptop?: string;
    desktop?: string;
  };
  paddingTop?: {
    mobile?: string;
    tablet?: string;
    laptop?: string;
    desktop?: string;
  };
}

// 漢字によって中心の位置が微妙に違うため、高さを調整する必要がある。
export const RequiredBadge: React.FC<CustomBadgeProps> = ({
  char = '必',
  backgroundColor = red[600],
  height = {
    mobile: '32px',
    laptop: '48px',
  },
  paddingTop = { mobile: '1.2px', laptop: '1px' },
}) => {
  return (
    <CustomBadge
      backgroundColor={backgroundColor}
      height={height}
      paddingTop={paddingTop}
    >
      {char}
    </CustomBadge>
  );
};

export const ObtainedBadge: React.FC<CustomBadgeProps> = ({
  char = '了',
  backgroundColor = blue[600],
  height = {
    mobile: '32px',
    laptop: '48px',
  },
  paddingTop = { mobile: '2px', laptop: '2px' },
}) => {
  return (
    <CustomBadge
      backgroundColor={backgroundColor}
      height={height}
      paddingTop={paddingTop}
    >
      {char}
    </CustomBadge>
  );
};

export const NotObtainedBadge: React.FC<CustomBadgeProps> = ({
  char = '未',
  backgroundColor = grey[500],
  height = {
    mobile: '32px',
    laptop: '48px',
  },
  paddingTop = { mobile: '1.2px', laptop: '1px' },
}) => {
  return (
    <CustomBadge
      backgroundColor={backgroundColor}
      height={height}
      paddingTop={paddingTop}
    >
      {char}
    </CustomBadge>
  );
};
