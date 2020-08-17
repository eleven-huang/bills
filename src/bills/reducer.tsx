import {BillData} from './bills'

export type BillsAction =
  | { type: "FILTER_MONTH", year: number, month: number}
  | { type: "RESET", bills: BillData[]}
  | { type: "SHOW_ALL"};

export function reducer(bills: BillData[], action: BillsAction): BillData[] {
  switch (action.type) {
    case "FILTER_MONTH":
      return bills.map((bill: BillData) => {
        let isShow: boolean = false;

        if (isTheRightMonth(bill, action.year, action.month)) {
            isShow = true;
        }

        return {...bill, isShow: isShow};
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

function isTheRightMonth(bill: BillData, year: number, month: number) {
  const date = new Date(bill.time);
  return (date.getFullYear() === year && date.getMonth() === month)
}
