'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { FC } from 'react';

interface QRCodeProps {
  url: string;
}

const QRCode: FC<QRCodeProps> = (props) => {
  return <QRCodeCanvas value={props.url} size={360} level={'M'} />;
};

export default QRCode;
