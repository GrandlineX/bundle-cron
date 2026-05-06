import {JestLib, setupDevKernel, TestContext, TestKernel } from '@grandlinex/core';
import CronModule from '../index.js';
import CronExtension from "../client/CronExtension.js";

const appName = 'TestKernel';
const appCode = 'tkernel';


const [kernel] = TestContext.getEntity(
    {
      kernel:new TestKernel(appName, appCode,__dirname),
      cleanUp:true,
      modLength:3
    }
);

kernel.addModule(new CronModule(kernel));

setupDevKernel(kernel);


JestLib.jestStart();
JestLib.jestCore();


describe('Cron', () => {
  const mod = kernel.getChildModule('cron') as CronModule;
  test('translator', async () => {
    const client = kernel.getExtension<CronExtension>("cron");
    await client?.registerCron({
      eventName: 'test-trigger',
      name: 'test',
      cron: '* 1 * * * *',
    });
    expect(await client?.stopCron('test')).toBeTruthy();
  });
});

JestLib.jestEnd();
