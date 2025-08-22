import { CMap, CoreKernelExtension, ICoreKernelModule } from '@grandlinex/core';
import * as nodeCron from 'node-cron';

export type CronRegistration = {
  name: string;
  cron: string;
  eventName: string;
};

export default class CronExtension extends CoreKernelExtension {
  private list: CMap<string, nodeCron.ScheduledTask>;

  private cronList: CronRegistration[];

  private started: boolean;

  constructor(
    mod: ICoreKernelModule<any, any, any, any, any>,
    cronList?: CronRegistration[],
  ) {
    super('cron', mod);
    this.list = new CMap();
    this.cronList = cronList || [];
    this.started = false;
  }

  async start() {
    this.started = true;
    this.cronList.forEach((cr) => this.startCron(cr));
  }

  async stop(): Promise<any> {
    this.list.forEach((cr) => {
      cr.stop();
    });
  }

  private async startCron({ name, cron, eventName }: CronRegistration) {
    this.log('register', `${name} @`, cron);
    this.list.set(
      name,
      nodeCron.schedule(cron, async () => {
        this.log('trigger', name);
        await this.getKernel().triggerEvent(eventName);
      }),
    );
  }

  async stopCron(name: string) {
    const task = this.list.get(name);
    if (task) {
      task.stop();
      this.list.delete(name);
      return true;
    }
    return false;
  }

  async registerCron(...cron: CronRegistration[]) {
    if (this.started) {
      for (const c of cron) {
        await this.startCron(c);
      }
    } else {
      this.cronList.push(...cron);
    }
  }
}
