import { IModuleDocument, IAddModule } from '@module/interfaces/module.interface';
import { ModuleService } from '@service/db/module.service';
import { BadRequestError } from '@global/helpers/error-handle';
import { UploadApiResponse, UploadStream } from 'cloudinary';
import { uploads } from '@global/helpers/cloudinary-upload';
import { Helpers } from '@global/helpers/helpers';
import HTTP_STATUS from 'http-status-codes';
import { IUserDocument } from '@user/interfaces/user.interface';
import { omit } from 'lodash';
import { config } from '@root/config';
import { moduleWorker } from '@worker/module.worker';
import { moduleSchema } from '@module/schemes/module';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { Request, Response } from 'express';
import { userService } from '@service/db/user.service';
import { ObjectId } from 'mongodb';
export class Add {
  public async create(req: Request, res: Response): Promise<void> {
    const { type, subType, icon, color } = req.body;
    const moduleId: ObjectId = new ObjectId();
    let imageSrc: string = icon;
    const existingUser: IUserDocument = await userService.getUserById(`${req.currentUser!.userId}`);
    if (!existingUser) {
      throw new BadRequestError('please login');
    }
    if (type === 3) {
      const iconId: ObjectId = new ObjectId();
      const result: UploadApiResponse = (await uploads(icon, `${iconId}`, true, true)) as UploadApiResponse;
      if (!result?.public_id) {
        throw new BadRequestError('File upload:Error occurren. Try again');
      }
      imageSrc = `https://res.cloudinary.com/dt8xp1l9e/image/upload/v${result.version}/${iconId}`;
    }

    const addData: IModuleDocument = Add.prototype.addData({
      type,
      subType,
      icon: imageSrc,
      _id: moduleId,
      userId: existingUser._id,
      color
    });
    console.log(addData, 'thisdata');
    moduleWorker.addModuleToDB(addData);

    res.status(HTTP_STATUS.OK).json({ message: 'Module created succcessfully' });
  }

  private addData(data: IAddModule): IModuleDocument {
    const { type, subType, icon, _id, userId, color } = data;
    return {
      type,
      subType,
      icon,
      _id,
      userId,
      color,
      createdAt: new Date()
    } as IModuleDocument;
  }
}
