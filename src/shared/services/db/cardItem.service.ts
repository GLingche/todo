import { IModuleDocument } from '@module/interfaces/module.interface';
import { IcardItemDocument, IAddMcardItem } from '@cardItem/interfaces/cardItem.interface';
import { CardItemModel } from '@cardItem/models/cardItem.schema';
import { ModuleModel } from '@module/models/module.schema';
import { Helpers } from '@global/helpers/helpers';
import mongoose from 'mongoose';

class CardItemServe {
  public async createCardItem(data: IcardItemDocument): Promise<void> {
    await CardItemModel.create(data);
  }

  // public async getModulesById(userId: string): Promise<Array<IModuleDocument>> {
  //   const mudoles: Array<IModuleDocument> = await ModuleModel.aggregate([
  //     { $match: { userId: new mongoose.Types.ObjectId(userId) } },
  //     { $lookup: { from: 'User', localField: 'userId', foreignField: '_id', as: 'userId' } },
  //     { $unwind: '$userId' },
  //     { $project: this.aggregateProject() }
  //   ]);

  //   return mudoles;
  // }

  public async getCardItemById(moduleId: string): Promise<Array<IcardItemDocument>> {
    const cardItem: Array<IcardItemDocument> = await CardItemModel.aggregate([
      { $match: { moduleId: new mongoose.Types.ObjectId(moduleId) } },
      { $lookup: { from: 'Module', localField: 'moduleId', foreignField: '_id', as: 'moduleId' } },
      { $unwind: '$moduleId' },
      { $project: this.aggregateProject() }
    ]);

    return cardItem;
  }

  private aggregateProject() {
    return {
      _id: 1,
      text: 1,
      list: 1,
      penPictrue: 1,
      process: 1,
      clock: 1,
      repetition: 1,
      location:1,
      test: '$moduleId.subType'
    };
  }
}

export const CardItemService: CardItemServe = new CardItemServe();
