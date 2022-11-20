import { IModuleDocument } from '@module/interfaces/module.interface';
import mongoose, { model, Model, Schema } from 'mongoose';
const moduleSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  type: { type: Number, default: 1 },
  subType: { type: String, default: '' },
  icon: { type: String, default: '' },
  done: { type: Number, default: 0 }
});


const ModuleModel:Model<IModuleDocument> = model<IModuleDocument>('Module',moduleSchema,'Module');
export  {ModuleModel};
