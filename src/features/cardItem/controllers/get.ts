import { IModuleDocument } from '@module/interfaces/module.interface';
import { userService } from '@service/db/user.service';
import { IUserDocument } from '@user/interfaces/user.interface';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import {ModuleService} from '@service/db/module.service'
import { BadRequestError } from "@global/helpers/error-handle";



export class Get {
  public async read(req: Request, res: Response): Promise<void> {
    let Modules = null;

    const existingUser: IUserDocument = await userService.getUserByAuthId(`${req.currentUser!.userId}`);

    if(!existingUser) {
      throw new BadRequestError('please login')
    }else{
      const existingModules:Array<IModuleDocument> = await ModuleService.getModulesById(`${existingUser._id}`);
      Modules = existingModules
    }
    res.status(HTTP_STATUS.OK).json({ Modules });
  }
}
