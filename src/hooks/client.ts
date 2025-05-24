import { atom, useAtomValue } from 'jotai';
import { useMemo } from 'react';

import { APIClient } from '@/utils/APIClient';

export const apiClientAtom = atom<APIClient>(() => new APIClient());
export const useAPI = (): APIClient =>
  useAtomValue(useMemo(() => atom((get) => get(apiClientAtom)), []));
