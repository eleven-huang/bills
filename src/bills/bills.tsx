import React, {useReducer, useEffect} from 'react';
import {reducer} from './reducer';
import './bills.css'
import {Table, Container} from 'react-bootstrap'
import Statistics from './statistics'
import Filters, {BillTypeOption, CategoryOption} from './filters'
import AddBill from './add_bill'
import {PAID, RECEIVED} from './constants'


export type BillData = {
  time: number,
  type: number,
  category: string,
  amount: number,
  isFilteredByMonth: boolean,
  isFilteredByCategory: boolean,
  isFilteredByBillType: boolean
}

export type CategoryData = {
  id: string,
  type: number,
  name: string
}

export type Props = {
  bills: BillData[],
  categories: CategoryData[]
}

const Bills: React.FunctionComponent<Props> = (props): JSX.Element => {
    const [bills, dispatch] = useReducer(reducer, []);

    useEffect(() => {
      dispatch({type: "RESET", bills: props.bills})
    }, [props.bills, props.categories])

    const billAdded = (bill: BillData): void => {
      console.log(bill);
      dispatch({type: "ADD", bill: bill})
    }

    const selectDate = (date: any): void => {
      if (date === null) {
        dispatch({type: "SHOW_ALL"});
      } else {
        dispatch({type: "FILTER_MONTH", year: date.getFullYear(), month: date.getMonth()});
      }
    }

    const selectCategoryOption = (option: CategoryOption): void => {
      dispatch({type: "FILTER_CATEGORY", category: option.id});
    }

    const selectBillTypeOption = (option: BillTypeOption): void => {
      dispatch({type: "FILTER_BILL_TYPE", bill_type: option.type})
    }

    const billsForShow = getBillsForShow(bills);
    const listBills = billsForShow.map((bill: BillData, index: number) => {
        const category: CategoryData = getCategoryById(props.categories, bill.category);

        return(
          <tr key={index}>
            <td>{bill.amount}</td>
            <td>{category.name}</td>
            <td>{dateFormat(bill.time)}</td>
            <td className={cssClassNameForBillType(bill.type)}>{getBillTypeName(bill.type)}</td>
          </tr>
        )
    });

    return (
      <Container className="container" fluid="md">
        <Filters categories={props.categories} selectDate={selectDate} selectCategoryOption={selectCategoryOption} selectBillTypeOption={selectBillTypeOption} />
        <span className="add-bill"><AddBill categories={props.categories} billAdded={billAdded} /></span>
        <Table className="bills" striped bordered hover>
          <thead>
            <tr>
              <th>金额</th>
              <th>分类</th>
              <th>时间</th>
              <th>类型</th>
            </tr>
          </thead>
          <tbody>
            {listBills}
            <tr>
              <td colSpan={4}>
                <strong><span className="red">支出:</span> {billsPaidAmount(billsForShow)} </strong>
                <strong><span className="green">收入:</span> {billsReceivedAmount(billsForShow)}</strong>
              </td>
            </tr>
          </tbody>
        </Table>

        <Statistics bills={billsForShow} categories={props.categories}/>
      </Container>
    )
}

function getCategoryById(categories: CategoryData[], id: string): CategoryData {
  const category: CategoryData | undefined = categories.find((category: CategoryData) => category.id === id);
  if (category === undefined) {
      throw new Error("账单数据出错，请联系客服处理。");
  }

  return category;
}

function getBillTypeName(type: number): string {
  if (type === RECEIVED) return "收入";

  return "支出";
}

function billsPaidAmount(bills: BillData[]): number {
  let amount = 0;
  bills.forEach((bill: BillData) => {
    if (bill.type === PAID) {
        amount += bill.amount;
    }
  });

  return amount;
}

function billsReceivedAmount(bills: BillData[]): number {
  let amount = 0;
  bills.forEach((bill: BillData) => {
    if (bill.type === RECEIVED) {
        amount += bill.amount;
    }
  });

  return amount;
}

function dateFormat(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString("zh-CN")
}

function getBillsForShow(bills: BillData[]): BillData[] {
  return bills.filter(bill => bill.isFilteredByMonth && bill.isFilteredByCategory && bill.isFilteredByBillType);
}

function cssClassNameForBillType(bill_type: number): string {
  if (bill_type === PAID) return "red";

  return "green";
}


export default Bills;
export {
  getBillTypeName
}
