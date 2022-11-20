import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { userService } from '@service/db/user.service';
import { IUserDocument } from '@user/interfaces/user.interface';

const log: Logger = config.createLogger('authWorker');

class UserWorker {
  async addUserToDB(obj:IUserDocument): Promise<void> {
    try {
      //add method to send data to database
      await userService.addUserData(obj);
    } catch (error) {
      log.error(error);
    }
  }
}

export const userWorker: UserWorker = new UserWorker();
