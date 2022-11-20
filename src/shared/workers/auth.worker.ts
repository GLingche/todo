import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { authService } from '@service/db/auth.service';
import { IAuthDocument } from '@auth/interfaces/auth.interface';

const log: Logger = config.createLogger('authWorker');

class AuthWorker {
  async addAuthUserToDB(auth:IAuthDocument): Promise<void> {
    try {
      //add method to send data to database
      await authService.createAuthUesr(auth);
    } catch (error) {
      log.error(error);
    }
  }
}

export const authWorker: AuthWorker = new AuthWorker();
