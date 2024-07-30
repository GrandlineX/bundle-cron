import * as Path from 'path';
import {
  JestLib,
  setupDevKernel,
  TestContext,
  TestKernel,
  XUtil,
} from '@grandlinex/core';
import CronModule from '../index.js';
import CronClient from '../client/CronClient.js';

const appName = 'TestKernel';
const appCode = 'tkernel';
const [testPath] = XUtil.setupEnvironment(
  [__dirname, '..'],
  ['data', 'config'],
);
const pathToTranslation = Path.join(__dirname, 'res');
const defaultLangKey = 'en';

const [kernel] = TestContext.getEntity({
  kernel: new TestKernel(appName, appCode, testPath, __dirname),
  cleanUpPath: testPath,
});
const store = kernel.getConfigStore();

kernel.addModule(new CronModule(kernel));

setupDevKernel(kernel);

describe('Clean start', () => {
  test('preload', async () => {
    expect(kernel.getState()).toBe('init');
  });
  test('start kernel', async () => {
    const result = await kernel.start();
    expect(result).toBe(true);
    expect(kernel.getModCount()).toBe(3);
    expect(kernel.getState()).toBe('running');
  });
});
JestLib.jestCore();
describe('TestDatabase', () => {
  test('get version', async () => {
    const db = kernel.getChildModule('testModule')?.getDb();
    const conf = await db?.getConfig('dbversion');
    expect(conf?.c_value).not.toBeNull();
  });
});

describe('MultiLang', () => {
  const mod = kernel.getChildModule('cron') as CronModule;
  test('translator', async () => {
    const client = mod.getClient() as CronClient;
    await client.registerCron({
      eventName: 'test-trigger',
      name: 'test',
      cron: '* 1 * * * *',
    });
    expect(await client.stopCron('test')).toBeTruthy();
  });
});

JestLib.jestEnd();
