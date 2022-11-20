import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface';
import { authService } from '@root/shared/services/db/auth.service';
import { userService } from '@root/shared/services/db/user.service';
import { BadRequestError } from '@global/helpers/error-handle';
import { Helpers } from '@global/helpers/helpers';
import { UploadApiResponse, UploadStream } from 'cloudinary';
import HTTP_STATUS from 'http-status-codes';
import { IUserDocument } from '@user/interfaces/user.interface';
import { omit } from 'lodash';
import JWT from 'jsonwebtoken';
import { config } from '@root/config';
import { authWorker } from '@worker/auth.worker';
import { userWorker } from '@worker/user.worker';
import { object } from 'joi';
const https = require('https');

export class SignUp {
  public async create(req: Request, response: Response): Promise<void> {
    const { username, email, password, avatarImage, jsCode } = req.body;
    let rawData = '';
    await https
      .get(
        `https://api.weixin.qq.com/sns/jscode2session?appid=${config.App_ID}&secret=${config.App_Secret}&js_code=${jsCode}&grant_type=authorization_code`,
        (res: Response) => {
          if (res.statusCode == 200) {
            res.on('data', (chunk) => {
              rawData += chunk;
            });

            res.on('end', async () => {
              let data: { openid?: any } = {};
              data = JSON.parse(rawData);

              let uId: string = data.openid;
              if (!uId) {
                uId = `${Helpers.generateRandomIntegers(12)}`;
              }

              const checkIfUserExist: IAuthDocument = await authService.getUserByUID(uId);

              if (checkIfUserExist) {
                const user: IUserDocument = await userService.getUserByAuthId(checkIfUserExist._id as string);
                const userJwt: string = SignUp.prototype.signToken(checkIfUserExist, user._id as ObjectId);
                const userDataForCache: IUserDocument = SignUp.prototype.userData(checkIfUserExist, user._id as ObjectId);
                req.session = { jwt: userJwt };

                response.status(HTTP_STATUS.OK).json({ message: 'User login sucessfully', user: userDataForCache, token: userJwt });

                return;
              }

              const authObjectId: ObjectId = new ObjectId();
              const userObjectId: ObjectId = new ObjectId();
              const authData: IAuthDocument = SignUp.prototype.signupData({
                _id: authObjectId,
                email,
                password,
                username,
                uId,
                avatarImage
              });

              const userDataForCache: IUserDocument = SignUp.prototype.userData(authData, userObjectId);

              //Add to database (omit：delete some prototype)
              omit(userDataForCache, ['uId', 'username', 'eamil', 'avatarImage', 'passwrod']);
              authWorker.addAuthUserToDB(authData);
              userWorker.addUserToDB(userDataForCache);

              const userJwt: string = SignUp.prototype.signToken(authData, userObjectId);
              req.session = { jwt: userJwt };

              response.status(HTTP_STATUS.OK).json({ message: 'User created successfully', user: userDataForCache, token: userJwt });
              // console.log(JSON.parse(rawData),'rawData');
            });
          }
        }
      )
      .on('error', (e: Error) => {
        console.log(e);
      });
  }

  private signToken(data: IAuthDocument, userObjectId: ObjectId): string {
    return JWT.sign(
      {
        userId: userObjectId,
        uId: data.uId,
        email: data.email,
        usernmae: data.username,
        avatarImage: data.avatarImage
      },
      config.JWT_TOKEN!
    );
  }

  private signupData(data: ISignUpData): IAuthDocument {
    const { _id, email, password, username, uId, avatarImage } = data;
    return {
      _id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email: email,
      password,
      avatarImage,
      createdAt: new Date()
    } as IAuthDocument;
  }

  private userData(data: IAuthDocument, userobjectId: ObjectId): IUserDocument {
    const { _id, username, email, uId, password, avatarImage } = data;
    return {
      _id: userobjectId,
      authId: _id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email,
      password,
      avatarImage,
      profilePicture: '',
      records: 0,
      createTaps: 0,
      collectTaps: 0,
      blocked: [],
      blockedBy: [],
      work: '',
      location: '',
      school: '',
      quote: '子弹小白',
      bgImageversion: '',
      bgImageId: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
      }
    } as unknown as IUserDocument;
  }
}
