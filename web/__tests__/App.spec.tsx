import { waitForDomChange, render } from '@testing-library/react';
import * as api from 'lib/api';
import { App } from 'components/App';
import React from 'react';

const { APP_AUTH_URL, APP_HOME_URL, NAME } = process.enve;

test('<App> unauth', async () => {
  // Mock API
  const mockGet = jest.fn();
  mockGet.mockRejectedValueOnce(undefined);
  (api as any).api = { get: mockGet };

  // Render unauthenticated view
  const { getByText } = render(<App />);
  await waitForDomChange();
  getByText('Login');

  // Validate back button
  const btn = getByText(`Back to ${NAME}`);
  expect(btn.parentElement.getAttribute('href')).toBe(APP_HOME_URL);
});

test('<App> auth', async () => {
  // Mock API
  const mockGet = jest.fn();
  mockGet.mockResolvedValueOnce({
    data: { hasPassword: false, hasTOTP: false, email: 'test@example.com' }
  });
  (api as any).api = { get: mockGet };

  // Render authenticated
  const { getByText } = render(<App />);
  await waitForDomChange();
  getByText('test@example.com');

  // Validate back button
  const btn = getByText(`Back to ${NAME}`);
  expect(btn.parentElement.getAttribute('href')).toBe(
    APP_AUTH_URL.replace('%JWT%', '0')
  );
});
