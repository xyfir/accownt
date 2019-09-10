import { config } from 'dotenv';
config();
import 'app-module-path/register';
import 'jest-extended';
import 'enve';

import { emailToId } from 'lib/email/to-id';
import * as storage from 'node-persist';

const { TEST_STORAGE } = process.enve;

beforeAll(async () => {
  try {
    const userId = await emailToId('test@example.com');
    await storage.init(TEST_STORAGE);
    await storage.removeItem(`user-${userId}`);
    await storage.removeItem(`email-test@example.com`);
  } catch (err) {
    return;
  }
});
