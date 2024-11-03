import { Not, UpdateResult } from 'typeorm';
import { CardEntity } from '../../../entities/cardEntity';
import { TableEntity } from '../../../entities/tableEntity';
import { pgConnection } from '../../data-source';
import { CardCreateType } from './create/create.model';
import { CardUpdateType } from './update/update.model';

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

  public async updateCardOrder(table: TableEntity, tableId: number, cardId: number, order: number): Promise<CardEntity[] | null> {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      const card = await this.queryRunner.manager.findOne(CardEntity, { where: { id: cardId } });
      if (!card) {
        throw new Error('Invalid card infoemation');
      }
      const oldTableId = card.table_id;
      card.table = table;
      card.table_id = tableId;
      const cardList = await this.queryRunner.manager.find(CardEntity, { where: { table_id: tableId, id: Not(cardId) }, order: { order: 'ASC' } });
      const validOrder = order > cardList.length ? cardList.length + 1 : order;
      cardList.splice(validOrder - 1, 0, card);
      const updatedcardList = cardList.map((card: CardEntity, idx: number) => {
        card.order = idx + 1;
        return card;
      });
      await this.queryRunner.manager.save(updatedcardList);
      if (tableId !== oldTableId) {
        const oldCardList = await this.queryRunner.manager.find(CardEntity, { where: { table_id: oldTableId, id: Not(cardId) }, order: { order: 'ASC' } });
        const updatedOldCardList = oldCardList.map((card: CardEntity, idx: number) => {
          card.order = idx + 1;
          return card;
        });
        await this.queryRunner.manager.save(updatedOldCardList);
      }
      await this.queryRunner.commitTransaction();
      return cardList;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      if (err instanceof Error) {
        throw new Error(`Transaction failed: ${err.message}`);
      } else {
        throw new Error('Unknown error');
      }
    } finally {
      await this.queryRunner.release();
    }
  }
}
