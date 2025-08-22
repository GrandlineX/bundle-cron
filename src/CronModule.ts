import { CoreKernelModule, ICoreKernel } from '@grandlinex/core';
import CronExtension from './client/CronExtension.js';

export default class CronModule extends CoreKernelModule<
  ICoreKernel<any>,
  null,
  null,
  null,
  null
> {
  extension: CronExtension;

  constructor(kernel: ICoreKernel<any>) {
    super('cron', kernel);
    this.extension = new CronExtension(this);
    kernel.addExtension('cron', this.extension);
  }

  async initModule(): Promise<void> {
    return Promise.resolve();
  }
}
