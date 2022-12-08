import { IModuleDocument, IAddModule } from '@module/interfaces/module.interface';
import { IcardItemDocument,IAddMcardItem } from '@cardItem/interfaces/cardItem.interface';
import { ModuleService } from '@service/db/module.service';
import { BadRequestError } from '@global/helpers/error-handle';
import { Helpers } from '@global/helpers/helpers';
import HTTP_STATUS from 'http-status-codes';
import { IUserDocument } from '@user/interfaces/user.interface';
import { omit } from 'lodash';
import { config } from '@root/config';
import { UploadApiResponse, UploadStream } from 'cloudinary';
import { uploads } from '@global/helpers/cloudinary-upload';
import { moduleWorker } from '@worker/module.worker';
import { cardItemWorker } from '@worker/cardItem.worker';
import { moduleSchema } from '@module/schemes/module';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { Request, Response } from 'express';
import { userService } from '@service/db/user.service';
import { ObjectId } from 'mongodb';
export class Add {
  public async create(req: Request, res: Response): Promise<void> {
    const { text, list, penPictrue,clock,repetition,location,cardType,tagName} = req.body;
    // const existingUser: IUserDocument = await userService.getUserByAuthId(`${req.currentUser!.userId}`);
    // if (!existingUser) {
    //   throw new BadRequestError('please login');
    // }

    const existingModules:IModuleDocument = await ModuleService.getModulesId('6364d04dbfa7cb0bcc4ea533',cardType,tagName);
    if(!existingModules){
      throw new BadRequestError('no modules match');
    }
    console.log(existingModules)
    const cardItemId: ObjectId = new ObjectId();

    const addData: IcardItemDocument = Add.prototype.addData({
      text,
      list,
      penPictrue,
      _id: cardItemId,
      moduleId: existingModules._id,
      clock,
      repetition,
      location
    });
    console.log(addData, 'thisdata');
    cardItemWorker.addCardItemToDB(addData);

    res.status(HTTP_STATUS.CREATED).json({ message: 'CardItem created succcessfully' });
  }

  private addData(data: IAddMcardItem): IcardItemDocument {
    const { text, list, penPictrue, _id, moduleId, clock ,repetition,location} = data;
    return {
      text,
      list,
      penPictrue,
      _id,
      moduleId,
      repetition,
      location,
      clock,
      createdAt: new Date()
    } as IcardItemDocument;
  }
}
