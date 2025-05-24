import { PrimitiveAtom, useAtom } from 'jotai';

export type AnchorPopup = [
  anchorEl: HTMLElement | null,
  setAnchorEl: (el: HTMLElement | null) => void,
];

export const useAnchorPopup = (
  atom: PrimitiveAtom<HTMLElement | null>
): AnchorPopup => {
  const [anchorEl, setAnchorEl] = useAtom(atom);

  return [anchorEl, setAnchorEl];
};
