export const cardUpdateModel = {
  projectId: 1,
  cardId: 1,
  tableId: 1,
  title: '',
  order: 1,
  desc: '',
  card_color: '',
  start_date: new Date(),
  end_date: new Date(),
};

export type CardUpdateType = {
  projectId?: number;
  cardId: number;
  table_id: number;
  title: string;
  order: number;
  desc: string;
  card_color: string;
  start_date: Date;
  end_date: Date;
};
