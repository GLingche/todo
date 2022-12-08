import mongoose,{Document} from 'mongoose'
import { ObjectId } from 'mongodb';
export interface IcardItemDocument extends Document {
   _id:string | ObjectId;
   moduleId:string | ObjectId;
   text:string;
   list:Array<string>;
   penPictrue:string;
   process:Number;
   clock:string;
   repetition:boolean;
   location:string;
   createdAt?: Date;
}


export interface IAddMcardItem {
  _id:string | ObjectId;
  moduleId:string | ObjectId;
  text:string;
  list:Array<string>;
  penPictrue:string;
  clock:string;
  repetition:boolean;
  location:string;
}



