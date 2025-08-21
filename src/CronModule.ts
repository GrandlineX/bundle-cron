import {
  type CoreKernel,
  CoreKernelModule,
  ICoreKernel,
} from '@grandlinex/core';
import CronExtension from './client/CronClient.js';

export default class CronModule extends CoreKernelModule<
  ICoreKernel<any>,
  any,
  CronExtension,
  any,
  any
> {
  extension: CronExtension;

  constructor(kernel: ICoreKernel<any>) {
    super('cron', kernel);
    this.extension = new CronExtension(this);
    (kernel as CoreKernel<any>).addExtension('cron', this.extension);
  }

  async initModule(): Promise<void> {
    this.setClient(new CronExtension(this));
  }

  async final() {
    await this.extension.start();
  }
}
