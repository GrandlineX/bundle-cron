import { CoreService, ICoreKernel, ICoreKernelModule } from '@grandlinex/core';
import CronExtension from '../client/CronExtension.js';

export default abstract class CronService extends CoreService<
  ICoreKernel<any>
> {
  cron: string;

  eventName: string;

  constructor(
    mod: ICoreKernelModule<any, any, any, any, any>,
    cron: string,
    eventName: string,
  ) {
    super(eventName, mod, false);
    this.cron = cron;
    this.eventName = eventName;
    this.getKernel().on(eventName, async () => {
      return this.cronAction();
    });
  }

  abstract cronAction(): Promise<void>;

  async start(): Promise<any> {
    const cron = this.getKernel().getExtension<CronExtension>('cron');
    if (cron) {
      await cron.registerCron({
        cron: this.cron,
        eventName: this.eventName,
        name: this.channel,
      });
    } else {
      this.error(
        `CronService: Cron extension not found, cannot register cron action for ${this.channel}`,
      );
    }
  }

  async stop(): Promise<any> {
    return Promise.resolve();
  }
}
