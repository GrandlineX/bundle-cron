import { CoreClient, ICoreKernelModule } from '@grandlinex/core';
import { CronRegistration, CronService } from '../service/CronService.js';

export default class CronClient extends CoreClient {
  service: CronService;

  constructor(mod: ICoreKernelModule<any, any, any, any, any>) {
    super('cron', mod);
    this.service = new CronService(mod);
    mod.addService(this.service);
  }

  async start() {
    await this.getModule().startService(this.service.getName());
  }

  async registerCron(...cron: CronRegistration[]) {
    if (this.service.started) {
      for (const c of cron) {
        await this.service.startCron(c);
      }
    } else {
      this.service.cronList.push(...cron);
    }
  }

  async stopCron(name: string) {
    return this.service.stopCron(name);
  }
}
