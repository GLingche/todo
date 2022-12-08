import { IcardItemDocument } from '@cardItem/interfaces/cardItem.interface';
import mongoose, { model, Model, Schema } from 'mongoose';
const cardItemSchema: Schema = new Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  text: { type: String, default: ''},
  list: { type: Array<String>, default: [] },
  penPictrue: { type: String, default: '' },
  process:{ type:Number, default: 0},
  clock: { type: String, default: '' },
  repetition: { type: Boolean, default: false },
  location: { type: String, default: '' },
});


const CardItemModel:Model<IcardItemDocument> = model<IcardItemDocument>('CardItem',cardItemSchema,'CardItem');
export  {CardItemModel};
