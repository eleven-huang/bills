import React, {useReducer, useState, useMemo} from 'react';
import {reducer} from './reducer';
import './bills.css'
import * as d3 from 'd3-fetch'
import {Table, Container} from 'react-bootstrap'

import DatePicker, { registerLocale }  from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import zh from "date-fns/locale/zh-CN";
registerLocale("zh-CN", zh);


const PAID: number = 0;
const RECEIVED: number = 1;

export type BillData = {
  time: number,
  type: number,
  category: string,
  amount: number,
  isShow: boolean
}

export type CategoryData = {
  id: string,
  type: number,
  name: string
}

const Bills: React.FunctionComponent = (): JSX.Element => {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>();
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

    const selectDate = (date: any) => {
      setSelectedDate(date);
      if (date === null) {
        dispatch({type: "SHOW_ALL"});
      } else {
        dispatch({type: "FILTER_MONTH", year: date.getFullYear(), month: date.getMonth()});
      }
    }

    const billsForShow = bills.filter(bill => bill.isShow);
    const listBills = billsForShow.map((bill: BillData, index: number) => {
        const category: CategoryData = getCategoryById(categories, bill.category);

        return(
          <tr key={index}>
            <td>{bill.amount}</td>
            <td>{category.name}</td>
            <td>{dateFormat(bill.time)}</td>
            <td>{billTypeName(bill.type)}</td>
          </tr>
        )
    });

    return (
      <Container className="container" fluid="md">
        <div className="filters">
          <div>
            <strong>月份</strong>
            <DatePicker
              selected={selectedDate}
              onChange={date => selectDate(date)}
              dateFormat="yyyy/MM"
              showMonthYearPicker
              locale="zh-CN"
              placeholderText="所有"
              openToDate={new Date("2019/01/01")}
            />
          </div>
        </div>
        <Table striped bordered hover>
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
          </tbody>
        </Table>

        <div className="footer">
          <strong className="red">支出: {billsPaidAmount(billsForShow)} </strong>
          <strong className="green">收入: {billsReceivedAmount(billsForShow)}</strong>
        </div>
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

    bills.push({type, amount, time: time, category: bill.category, isShow: true});
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

function amountByCategories(bills: BillData[]) {

}


export default Bills;
