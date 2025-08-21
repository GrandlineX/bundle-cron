import * as nodeCron from 'node-cron';

import {
  CMap,
  CoreService,
  ICoreKernel,
  ICoreKernelModule,
} from '@grandlinex/core';

export type CronRegistration = {
  name: string;
  cron: string;
  eventName: string;
};
export class CronService extends CoreService<ICoreKernel<any>> {
  list: CMap<string, nodeCron.ScheduledTask>;

  cronList: CronRegistration[];

  started: boolean;

  constructor(
    mod: ICoreKernelModule<any, any, any, any, any>,
    cronList: CronRegistration[] = [],
  ) {
    super('chron-service', mod, true);
    this.list = new CMap();
    this.cronList = cronList;
    this.started = false;
  }

  async startCron({ name, cron, eventName }: CronRegistration) {
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

  async start(): Promise<any> {
    this.started = true;
    this.cronList.forEach((cr) => this.startCron(cr));
  }

  async stop(): Promise<any> {
    this.list.forEach((cr) => {
      cr.stop();
    });
  }
}
