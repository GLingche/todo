import { IModuleDocument,IAddModule } from "@module/interfaces/module.interface";
import { ModuleService } from "@service/db/module.service";
import { BadRequestError } from "@global/helpers/error-handle";
import { Helpers } from '@global/helpers/helpers';
import HTTP_STATUS from 'http-status-codes';
import { IUserDocument } from '@user/interfaces/user.interface';
import { omit } from 'lodash';
import { config } from '@root/config';
import { moduleWorker } from "@worker/module.worker";
import { moduleSchema } from "@module/schemes/module"
import { joiValidation } from "@global/decorators/joi-validation.decorators";
import { Request, Response } from 'express';
import { userService } from '@service/db/user.service';
import { ObjectId } from 'mongodb';
export class Add {
  public async create(req:Request,res:Response):Promise<void> {
    const {type,subType,icon} = req.body;

    const existingUser: IUserDocument = await userService.getUserByAuthId(`${req.currentUser!.userId}`);
    if(!existingUser) {
      throw new BadRequestError('please login')
    }

    const moduleId:ObjectId = new ObjectId();

    const addData:IModuleDocument = Add.prototype.addData({
      type,
      subType,
      icon,
      _id:moduleId,
      userId:existingUser._id
    })
    console.log(addData,"thisdata")
    moduleWorker.addModuleToDB(addData);

    res.status(HTTP_STATUS.CREATED).json({ message: 'Module created succcessfully'});

  }


  private addData(data:IAddModule):IModuleDocument{
     const {type,subType,icon,_id,userId} = data;
     return {
      type,
      subType,
      icon,
      _id,
      userId,
      createdAt:new Date()
     } as IModuleDocument;
  }

}
