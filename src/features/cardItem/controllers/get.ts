import { IModuleDocument } from '@module/interfaces/module.interface';
import { userService } from '@service/db/user.service';
import { IUserDocument } from '@user/interfaces/user.interface';
import { ModuleService } from '@service/db/module.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { CardItemService } from '@service/db/cardItem.service';
import { BadRequestError } from '@global/helpers/error-handle';
import { IcardItemDocument, IAddMcardItem } from '@cardItem/interfaces/cardItem.interface';
export class Get {
  public async read(req: Request, res: Response): Promise<void> {
    let cardItem = new Array();
    const { type } = req.query as any;

    const existingUser: IUserDocument = await userService.getUserById(`${req.currentUser!.userId}`);

    const existingModule: Array<IModuleDocument> = await ModuleService.getModulesIdByType(`${existingUser._id}`, type);

    if (!existingModule) {
      throw new BadRequestError('error');
    }
    for (let i = 0; i < existingModule.length; i++) {
      let tempList = [];
      if (!existingUser) {
        throw new BadRequestError('please login');
      } else {
        const existingCardItem: Array<IcardItemDocument> = await CardItemService.getCardItemById(`${existingModule[i]._id}`);
        tempList = existingCardItem;
      }
      if (tempList.length !== 0) {
        cardItem.push(tempList);
      }
    }
    cardItem = cardItem.flat(1);
    res.status(HTTP_STATUS.OK).json({ cardItem });
  }
}
