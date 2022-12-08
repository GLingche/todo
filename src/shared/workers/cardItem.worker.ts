import Logger from 'bunyan';
import {config} from '@root/config';
import { CardItemService } from '@service/db/cardItem.service';
import { IcardItemDocument } from '@cardItem/interfaces/cardItem.interface';


const log:Logger = config.createLogger('cardItemWorker');

class CardItemWorker{

  async addCardItemToDB(obj:IcardItemDocument):Promise<void> {
    try{
      //add method to send data to database
      await CardItemService.createCardItem(obj)
    }catch(error) {
      log.error(error)
    }
  }
}

export const cardItemWorker:CardItemWorker = new CardItemWorker();
