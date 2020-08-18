import React, {useReducer, useState, useMemo} from 'react';
import {reducer} from './reducer';
import './bills.css'
import * as d3 from 'd3-fetch'
import {Table, Container} from 'react-bootstrap'
import Statistics from './statistics'
import Filters, {BillTypeOption, CategoryOption} from './filters'
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

const Bills: React.FunctionComponent = (): JSX.Element => {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [bills, dispatch] = useReducer(reducer, []);

    const getData = (): void => {
      //get categories first
      var csv_file_path = require("./data/bill_categories.csv");
      d3.csv(csv_file_path).then(function(data) {
        const categories = getConstructedCategoryData(data);
        setCategories(categories);

        getBills();
      });
    };

    const getBills = (): void => {
      var csv_file_path = require("./data/bills.csv");
      d3.csv(csv_file_path).then(function(data) {
        const bills: BillData[] = getConstructedBillData(data);
        dispatch({type: "RESET", bills: bills});
      });
    }

    //init values
    useMemo(() => {
      getData();
    }, [])

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
        const category: CategoryData = getCategoryById(categories, bill.category);

        return(
          <tr key={index}>
            <td>{bill.amount}</td>
            <td>{category.name}</td>
            <td>{dateFormat(bill.time)}</td>
            <td className={cssClassNameForBillType(bill.type)}>{billTypeName(bill.type)}</td>
          </tr>
        )
    });

    return (
      <Container className="container" fluid="md">
        <Filters categories={categories} selectDate={selectDate} selectCategoryOption={selectCategoryOption} selectBillTypeOption={selectBillTypeOption} />

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

        <Statistics bills={billsForShow} categories={categories}/>
      </Container>
    )
}

function getConstructedCategoryData(data: any): CategoryData[] {
  const categories: CategoryData[] = [];
  data.forEach((category: any) => {
    const type = parseInt(category.type);

    categories.push({type, id: category.id, name: category.name});
  })

  return categories;
}

function getConstructedBillData(data: any): BillData[] {
  const bills: BillData[] = [];
  data.forEach((bill: any) => {
    const amount: number = parseFloat(bill.amount);
    const type: number = parseInt(bill.type);
    const time: number = parseInt(bill.time);

    bills.push({type, amount, time: time, category: bill.category, isFilteredByMonth: true, isFilteredByCategory: true, isFilteredByBillType: true});
  })

  return bills;
}

function getCategoryById(categories: CategoryData[], id: string): CategoryData {
  const category: CategoryData | undefined = categories.find((category: CategoryData) => category.id === id);
  if (category === undefined) {
      throw new Error("Wrong categories or bills data");
  }

  return category;
}

function billTypeName(type: number): string {
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
  return date.toLocaleDateString("zh-CN")
}

function getBillsForShow(bills: BillData[]): BillData[] {
  return bills.filter(bill => bill.isFilteredByMonth && bill.isFilteredByCategory && bill.isFilteredByBillType);
}

function cssClassNameForBillType(bill_type: number): string {
  if (bill_type === PAID) return "red";

  return "green";
}


export default Bills;
