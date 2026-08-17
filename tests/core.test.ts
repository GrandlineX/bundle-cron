import {describe, test, expect} from "vitest"
import {
    TestLib,
    setupDevKernel,
    TestContext,
    TestKernel,
} from '@grandlinex/core/dev';
import  { CronModule, CronExtension} from "../src";

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


TestLib.testStart();
TestLib.testCore();


describe('Cron', () => {
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

TestLib.testEnd();
