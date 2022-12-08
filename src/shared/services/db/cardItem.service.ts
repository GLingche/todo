import { IModuleDocument } from '@module/interfaces/module.interface';
import { IcardItemDocument } from '@cardItem/interfaces/cardItem.interface';
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

  public async getCardItemById(userId: string): Promise<Array<IModuleDocument>> {
    const mudoles: Array<IModuleDocument> = await ModuleModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $lookup: { from: 'User', localField: 'userId', foreignField: '_id', as: 'userId' } },
      { $unwind: '$userId' },
      { $project: this.aggregateProject() }
    ]);

    return mudoles;
  }

  private aggregateProject() {
    return {
      _id: 1,
      type: 1,
      subType: 1,
      icon: 1,
      done: 1,
      createdAt: 1,
      color: 1,
      test: '$userId.postsCount'
    };
  }
}

export const CardItemService: CardItemServe = new CardItemServe();
