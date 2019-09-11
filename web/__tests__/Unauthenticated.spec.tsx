import { SnackbarProvider } from 'notistack';
import { Unauthenticated } from 'components/Unauthenticated';
import * as api from 'lib/api';
import React from 'react';
import {
  waitForDomChange,
  fireEvent,
  render,
  wait
} from '@testing-library/react';

const { APP_AUTH_URL } = process.enve;

test('<Unauthenticated> password + otp login', async () => {
  // Mock API for login
  const mockPost = jest.fn();
  (api as any).api = { post: mockPost };
  mockPost.mockResolvedValueOnce({ data: { jwt: 'jwt' } });

  // Mock navigation
  const mockAssign = ((location as any).assign = jest.fn());

  // Render Unauthenticated
  const { getByLabelText, getByText } = render(
    <SnackbarProvider>
      <Unauthenticated />
    </SnackbarProvider>
  );

  // Validate TOTP field not showing
  expect(() => getByLabelText('2FA Code')).toThrow();

  // Login
  fireEvent.change(getByLabelText('Email'), {
    target: { value: 'test@example.com' }
  });
  fireEvent.change(getByLabelText('Password'), { target: { value: '1234' } });
  fireEvent.change(getByLabelText('2FA Code'), { target: { value: '5678' } });
  fireEvent.click(getByText('Login'));
  await wait(() => expect(mockPost).toHaveBeenCalled());

  // Validate login
  expect(mockPost.mock.calls[0][0]).toBe('/login');
  expect(mockPost.mock.calls[0][1]).toMatchObject({
    email: 'test@example.com',
    pass: '1234',
    otp: '5678'
  });
  expect(mockAssign).toHaveBeenCalledTimes(1);
  expect(mockAssign).toHaveBeenCalledWith(APP_AUTH_URL.replace('%JWT%', 'jwt'));
});

test('<Unauthenticated> passwordless login', async () => {
  // Mock API for passwordless login
  const mockPost = jest.fn();
  (api as any).api = { post: mockPost };
  mockPost.mockResolvedValueOnce({});

  // Render Unauthenticated
  const { getByLabelText, getByText } = render(
    <SnackbarProvider>
      <Unauthenticated />
    </SnackbarProvider>
  );

  // Initiate login
  fireEvent.change(getByLabelText('Email'), {
    target: { value: 'test@example.com' }
  });
  fireEvent.click(getByText('Login'));
  await waitForDomChange();

  // Validate request
  expect(mockPost.mock.calls[0][0]).toBe('/login/passwordless');
  expect(mockPost.mock.calls[0][1]).toMatchObject({
    email: 'test@example.com'
  });

  // Validate alert
  getByText('passwordless login email has been sent', { exact: false });
});

test('<Unauthenticated> registration', async () => {
  // Mock reCAPTCHA
  const mockAppendChild = ((document.head as any).appendChild = jest.fn());
  const mockGetResponse = jest.fn();
  mockGetResponse.mockReturnValueOnce('recaptcha');
  (window as any).grecaptcha = {
    getResponse: mockGetResponse
  };

  // Mock API
  const mockPost = jest.fn();
  (api as any).api = { post: mockPost };

  // Mock API for checking email
  mockPost.mockResolvedValueOnce({ data: { available: false } });
  mockPost.mockResolvedValueOnce({ data: { available: true } });

  // Mock API for registration
  mockPost.mockResolvedValueOnce({});

  // Render Unauthenticated
  const { getByLabelText, getByText } = render(
    <SnackbarProvider>
      <Unauthenticated />
    </SnackbarProvider>
  );

  // Enable account creation
  fireEvent.click(getByLabelText('Create new account'));

  // Check email isn't available
  expect(() => getByText('already in use')).toThrow();
  fireEvent.change(getByLabelText('Email'), {
    target: { value: 'tes@example.com' }
  });
  await waitForDomChange();
  getByText('already in use', { exact: false });

  // Check email is available
  fireEvent.change(getByLabelText('Email'), {
    target: { value: 'test@example.com' }
  });
  await waitForDomChange();
  expect(() => getByText('already in use', { exact: false })).toThrow();

  // Register
  fireEvent.click(getByText('Register'));
  await waitForDomChange();
  getByText('verification email has been sent', { exact: false });

  // Validate mocks
  expect(mockPost).toHaveBeenCalledTimes(3);
  expect(mockPost.mock.calls[0][0]).toBe('/register/check-email');
  expect(mockPost.mock.calls[0][1]).toMatchObject({
    email: 'tes@example.com'
  });
  expect(mockPost.mock.calls[1][0]).toBe('/register/check-email');
  expect(mockPost.mock.calls[1][1]).toMatchObject({
    email: 'test@example.com'
  });
  expect(mockPost.mock.calls[2][0]).toBe('/register');
  expect(mockPost.mock.calls[2][1]).toMatchObject({
    recaptcha: 'recaptcha',
    email: 'test@example.com',
    pass: ''
  });
  expect(mockAppendChild).toHaveBeenCalled();
  expect(mockGetResponse).toHaveBeenCalledTimes(1);
});
