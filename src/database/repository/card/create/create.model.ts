export const cardCreateModel = {
  projectId: 1,
  tableId: 1,
  title: '',
  order: 1,
  desc: '',
  card_color: '',
  start_date: '',
  end_date: '',
};

export type CardCreateType = {
  projectId: number;
  table_id: number;
  title: string;
  order: number;
  desc: string;
  card_color: string;
  start_date: Date;
  end_date: Date;
};
