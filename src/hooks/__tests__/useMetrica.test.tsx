import { renderHook } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import React, { FC, ReactNode } from 'react';

import { metricaTagIDAtom } from '../../lib/atom';
import { useMetrica } from '../useMetrica';

const YM_MOCK = jest.fn();
Object.defineProperty(window, 'ym', {
  value: YM_MOCK,
  writable: true,
});

const store = createStore();
store.set(metricaTagIDAtom, 444);

const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

describe('useMetrica', () => {
  it('calls ym methods with correct parameters', () => {
    const { result } = renderHook(() => useMetrica(), { wrapper: Providers });
    const { notBounce, reachGoal, setUserID, userParams, ymEvent } = result.current;

    notBounce();

    expect(YM_MOCK).toHaveBeenCalledWith(444, 'notBounce', undefined);

    reachGoal('test', { order_price: 999 });

    expect(YM_MOCK).toHaveBeenCalledWith(444, 'reachGoal', 'test', { order_price: 999 }, undefined);

    setUserID('12345');

    expect(YM_MOCK).toHaveBeenCalledWith(444, 'setUserID', '12345');

    userParams({ status: 'Gold', UserID: 12345 });

    expect(YM_MOCK).toHaveBeenCalledWith(444, 'userParams', { status: 'Gold', UserID: 12345 });

    ymEvent('extLink', 'https://example.com/', { title: 'Test', params: { order_price: 999 } });

    expect(YM_MOCK).toHaveBeenCalledWith(444, 'extLink', 'https://example.com/', {
      title: 'Test',
      params: { order_price: 999 },
    });

    expect(YM_MOCK).toHaveBeenCalledTimes(5);
  });
});
