import {BillData} from './bills'

export type BillsAction =
  | { type: "FILTER_MONTH", month: number}
  | { type: "RESET", bills: BillData[]}
  | { type: "SHOW_ALL"};

export function reducer(bills: BillData[], action: BillsAction): BillData[] {
  switch (action.type) {
    case "FILTER_MONTH":
      return bills.map((bill: BillData) => {
        if (monthFromBillData(bill) !== action.month) {
          return {...bill, isShow: false}
        }

        return {...bill, isShow: true};
      });

    case "RESET":
      return action.bills;

    case "SHOW_ALL":
      return bills.map((bill: BillData) => {
        return {...bill, isShow: true};
      });

    default:
      return bills;
  }
}

function monthFromBillData(bill: BillData): number {
  const date = new Date(bill.time);
  return date.getMonth();
}
