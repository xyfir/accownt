import { waitForDomChange, render } from '@testing-library/react';
import * as api from 'lib/api';
import { App } from 'components/App';
import React from 'react';

test('<App> unauth', async () => {
  // Mock API
  const mockGet = jest.fn();
  mockGet.mockRejectedValueOnce(undefined);
  (api as any).api = { get: mockGet };

  // Render unauthenticated view
  const { getByText } = render(<App />);
  await waitForDomChange();
  getByText('Login');
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
  getByText('test@example.com', { exact: false });
});
