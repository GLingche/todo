import Logger from 'bunyan';
import {config} from '@root/config';
import { ModuleService } from '@service/db/module.service';
import { IModuleDocument } from '@module/interfaces/module.interface';


const log:Logger = config.createLogger('moduleWorker');

class ModuleWorker{
  async addModuleToDB(obj:IModuleDocument):Promise<void> {
    try{
      //add method to send data to database
      await ModuleService.createModule(obj)
    }catch(error) {
      log.error(error)
    }
  }
}

export const moduleWorker: ModuleWorker = new ModuleWorker();
