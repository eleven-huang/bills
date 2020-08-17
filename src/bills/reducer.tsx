import {BillData, ALL} from './bills'

export type BillsAction =
  | { type: "FILTER_MONTH", year: number, month: number}
  | { type: "FILTER_CATEGORY", category: string}
  | { type: "RESET", bills: BillData[]}
  | { type: "SHOW_ALL"};

export function reducer(bills: BillData[], action: BillsAction): BillData[] {
  switch (action.type) {
    case "FILTER_MONTH":
      const billsInTheSameMonth =  bills.map((bill: BillData) => {
        let isFilteredByMonth: boolean = false;
        if (isTheRightMonth(bill, action.year, action.month)) {
            isFilteredByMonth = true;
        }

        return {...bill, isFilteredByMonth: isFilteredByMonth};
      })

      return billsInTheSameMonth;
    case "FILTER_CATEGORY":
      if (action.category === ALL) {
        return bills.map((bill: BillData) => {
          return {...bill, isFilteredByCategory: true}
        })
      } else {
        const billsInTheSameCategory = bills.map((bill: BillData) => {
          let isFilteredByCategory = false;
          if (bill.category === action.category){
            isFilteredByCategory = true;
          }

          return {...bill, isFilteredByCategory: isFilteredByCategory};
        })

        return billsInTheSameCategory;
      }
    case "RESET":
      return action.bills;
    case "SHOW_ALL":
      return bills.map((bill: BillData) => {
        return {...bill, isFilteredByMonth: true};
      });

    default:
      return bills;
  }
}

function isTheRightMonth(bill: BillData, year: number, month: number) {
  const date = new Date(bill.time);
  return (date.getFullYear() === year && date.getMonth() === month)
}
