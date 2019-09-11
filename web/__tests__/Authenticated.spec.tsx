import { SnackbarProvider } from 'notistack';
import { Authenticated } from 'components/Authenticated';
import * as api from 'lib/api';
import React from 'react';
import {
  waitForDomChange,
  fireEvent,
  render,
  wait
} from '@testing-library/react';
import { Accownt } from 'types/accownt';

test('<Authenticated>', async () => {
  // Mock account
  const account: Accownt.Account = {
    hasPassword: true,
    hasTOTP: true,
    email: 'test@example.com'
  };

  // Mock API
  const mockPut = jest.fn();
  (api as any).api = { put: mockPut };

  // Mock API for setting/removing password
  mockPut.mockResolvedValueOnce({});
  mockPut.mockResolvedValueOnce({});

  // Mock API for setting/removing TOTP
  mockPut.mockResolvedValueOnce({ data: {} });
  mockPut.mockResolvedValueOnce({ data: { secret: 'secret123', url: 'abc' } });

  // Mock navigation
  const mockReload = ((location as any).reload = jest.fn());

  // Render Unauthenticated
  const { getByLabelText, getByText } = render(
    <SnackbarProvider>
      <Authenticated account={account} />
    </SnackbarProvider>
  );

  // Remove password
  fireEvent.click(getByText('Remove'));
  await wait(() => expect(mockReload).toHaveBeenCalledTimes(1));
  expect(mockPut).toHaveBeenCalledTimes(1);
  expect(mockPut.mock.calls[0][0]).toBe('/account/password');
  expect(mockPut.mock.calls[0][1]).toMatchObject({ pass: null });

  // Set password
  fireEvent.change(getByLabelText('Password'), { target: { value: '1234' } });
  fireEvent.click(getByText('Update'));
  await wait(() => expect(mockReload).toHaveBeenCalledTimes(2));
  expect(mockPut.mock.calls[1][0]).toBe('/account/password');
  expect(mockPut.mock.calls[1][1]).toMatchObject({ pass: '1234' });

  // Disable TOTP
  fireEvent.click(getByText('Disable'));
  await wait(() => expect(mockReload).toHaveBeenCalledTimes(3));
  expect(mockPut).toHaveBeenCalledTimes(3);
  expect(mockPut.mock.calls[2][0]).toBe('/account/totp');
  expect(mockPut.mock.calls[2][1]).toMatchObject({ enabled: false });

  // Regen TOTP
  fireEvent.click(getByText('Regenerate'));
  await waitForDomChange();
  expect(mockPut).toHaveBeenCalledTimes(4);
  expect(mockPut.mock.calls[3][0]).toBe('/account/totp');
  expect(mockPut.mock.calls[3][1]).toMatchObject({ enabled: true });
});
