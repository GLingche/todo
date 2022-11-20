import mongoose,{Document} from 'mongoose'
import { ObjectId } from 'mongodb';
export interface IModuleDocument extends Document {
   _id:string | ObjectId;
   userId:string | ObjectId;
   type:number;
   subType:string;
   icon:string;
   done:number;
   createdAt?: Date;
}


export interface IAddModule {
  _id:string | ObjectId;
  userId:string | ObjectId;
  type:number;
  subType:string;
  icon:string;
}



