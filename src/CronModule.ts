import { CoreKernelModule, ICoreKernel } from '@grandlinex/core';
import CronClient from './client/CronClient.js';

export default class CronModule extends CoreKernelModule<
  ICoreKernel<any>,
  any,
  CronClient,
  any,
  any
> {
  constructor(kernel: ICoreKernel<any>) {
    super('cron', kernel);
  }

  async initModule(): Promise<void> {
    this.setClient(new CronClient(this));
  }

  async final() {
    await this.getClient().start();
  }
}
