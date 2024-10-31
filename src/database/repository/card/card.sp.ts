import { UpdateResult } from 'typeorm';
import { CardEntity } from '../../../entities/cardEntity';
import { ProjectEntity } from '../../../entities/projectEntity';
import { TableEntity } from '../../../entities/tableEntity';
import { pgConnection } from '../../data-source';
import { CardCreateType } from './create/create.model';
import { CardUpdateType } from './update/update.model';
import { ApiError, BadRequestError } from '../../../core/ApiError';

export class CardDB {
  private cardRepository = pgConnection.getRepository(CardEntity);
  private queryRunner = pgConnection.createQueryRunner();

  public async getInfo(cardId: number): Promise<CardEntity | null> {
    try {
      const card = await this.cardRepository.findOneBy({ id: cardId });
      return card;
    } catch (err) {
      throw err;
    }
  }

  public async createCard(table: TableEntity, cardData: Partial<CardCreateType>): Promise<CardEntity | null> {
    try {
      const card = CardEntity.create({ ...cardData, table: table });
      const newCard = await this.cardRepository.save(card);
      return newCard;
    } catch (err) {
      throw err;
    }
  }

  public async updateCard(table: TableEntity, cardId: number, cardData: Partial<CardUpdateType>): Promise<UpdateResult | null> {
    try {
      const updateCard = await this.cardRepository.update(cardId, { ...cardData, table: table });
      return updateCard;
    } catch (err) {
      throw err;
    }
  }

  public async updateCardOrder(table: TableEntity, tableId: number, cardId: number, order: number): Promise<CardEntity | null> {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      // get all cards
      const card = await this.queryRunner.manager.findOne(CardEntity, { where: {id: cardId} });
      if(!card) {
        throw new Error('Invalid card');
      }
      const cardList = await this.queryRunner.manager.find(CardEntity, { where: {table_id: tableId} });
      console.log('prev card', cardList)
      // update the order
      const updatedcardList = cardList.map((card: CardEntity, idx: number) => {
        console.log('..........', card.order , idx + 1, order <= idx + 1 ? card.order + 1 : idx + 1 )
        card.order = order <= idx + 1 ? card.order + 1 : idx + 1;
        return card;
      });
      // save the changes
      console.log('Updated card', updatedcardList)
      const savedCardList = await this.queryRunner.manager.save(updatedcardList);
      card.order = order;
      card.table = table;
      card.table_id = tableId;
      const myCard = await this.queryRunner.manager.save(card);
      await this.queryRunner.commitTransaction();
      return myCard;
    } catch (err) {
      console.log('error',err)
      throw err;
    }
  }
}
