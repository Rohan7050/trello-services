import moment from 'moment';

export const billTemplate = (details: any) => {
  const { due_date, total_amount } = details;

  return `
        Dear Customer, your bill is generated. Total amount to be paid is ${total_amount} and the last date to pay the bill is ${moment(due_date).format('DD MMM, YYYY')}. 
    `;
};
