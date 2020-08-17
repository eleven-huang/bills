import React, {useReducer, useState, useMemo} from 'react';
import {reducer} from './reducer';
import './bills.css'
import * as d3 from 'd3-fetch'
import {Table, Container, Dropdown, Button} from 'react-bootstrap'

import DatePicker, { registerLocale }  from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import zh from "date-fns/locale/zh-CN";
registerLocale("zh-CN", zh);


export const PAID: number = 0;
export const RECEIVED: number = 1;
export const ALL: string = "所有";
export const ALL_BILL_TYPE = -1;

type CategoryOption = {
    id: string,
    name: string
}

type BillTypeOption = {
  type: number,
  name: string
}

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

export type BillStatistic = {
  category_name: string,
  amount: number
}

const Bills: React.FunctionComponent = (): JSX.Element => {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedCategoryOption, setSelectedCategoryOption] = useState<CategoryOption>();
    const [selectedBillTypeOption, setSelectedBillTypeOption] = useState<BillTypeOption>();

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
      setSelectedDate(date);
      if (date === null) {
        dispatch({type: "SHOW_ALL"});
      } else {
        dispatch({type: "FILTER_MONTH", year: date.getFullYear(), month: date.getMonth()});
      }
    }

    const selectCategoryOption = (option: CategoryOption): void => {
      setSelectedCategoryOption(option);
      dispatch({type: "FILTER_CATEGORY", category: option.id});
    }

    const getListCategoryOptions = (): JSX.Element => {
      const categoryOptions: CategoryOption[] = getCategoryOptions(categories);
      const listCategoryOptions: any = [];
      categoryOptions.forEach((option: CategoryOption) => {
        listCategoryOptions.push(<Dropdown.Item key={option.id} onClick={() => selectCategoryOption(option)}>{option.name}</Dropdown.Item>);
      });

      return listCategoryOptions;
    }

    const getListBillTypeOptions = (): JSX.Element => {
      const billTypeOptions: BillTypeOption[] = getBillTypeOptions();
      const listBillTypeOptions: any = [];
      billTypeOptions.forEach((option: BillTypeOption) => {
        listBillTypeOptions.push(<Dropdown.Item key={option.type} onClick={() => selectBillTypeOption(option)}>{option.name}</Dropdown.Item>);
      })

      return listBillTypeOptions;
    }

    const selectBillTypeOption = (option: BillTypeOption): void => {
      setSelectedBillTypeOption(option);
      dispatch({type: "FILTER_BILL_TYPE", bill_type: option.type})
    }

    const getListStatistics = (bills: BillData[]): JSX.Element => {
      const statistics: BillStatistic[] = getBillStatistics(bills, categories);
      const listStatistics: any = [];

      statistics.forEach((statistic: BillStatistic) => {
        listStatistics.push(
          <tr key={statistic.category_name}>
            <td>{statistic.category_name}</td>
            <td>{statistic.amount}</td>
          </tr>
        )
      });

      listStatistics.push(
        <tr>
          <td colSpan={4}>
            <strong><span className="red">总计:</span> {getStatisticsAmount(statistics)} </strong>
          </td>
        </tr>
      );

      return listStatistics;
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

        <div className="filters">
          <span className="filter">
            <strong className="filterName">月份</strong>
            <DatePicker
              selected={selectedDate}
              onChange={date => selectDate(date)}
              dateFormat="yyyy/MM"
              showMonthYearPicker
              locale="zh-CN"
              placeholderText={ALL}
              openToDate={new Date("2019/01/01")}
            />
          </span>
          <span className="filter">
            <strong className="filterName">分类</strong>
            <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-light">
                {selectedCategoryOption? selectedCategoryOption.name : ALL}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {getListCategoryOptions()}
              </Dropdown.Menu>
            </Dropdown>
          </span>
          <span className="filter">
            <strong className="filterName">类型</strong>
            <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-light">
                {selectedBillTypeOption? selectedBillTypeOption.name : ALL}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {getListBillTypeOptions()}
              </Dropdown.Menu>
            </Dropdown>
          </span>
        </div>

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

        <h4><span className="red">支出</span>分类统计</h4>
        <Table className="statistics" striped bordered hover>
          <thead>
            <tr>
              <th>分类</th>
              <th>金额汇总</th>
            </tr>
          </thead>
          <tbody>
            {getListStatistics(billsForShow)}
          </tbody>
        </Table>
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

function getCategoryOptions(categories: CategoryData[]): CategoryOption[] {
  const options: CategoryOption[] = [{id: ALL, name: ALL}];
  categories.forEach((category: CategoryData) => {
    options.push({id: category.id, name: category.name});
  });

  return options;
}

function getBillTypeOptions(): BillTypeOption[] {
  return [
    {type: ALL_BILL_TYPE, name: ALL},
    {type: PAID, name: "支出"},
    {type: RECEIVED, name: "收入"}
  ]
}

function getBillsForShow(bills: BillData[]): BillData[] {
  return bills.filter(bill => bill.isFilteredByMonth && bill.isFilteredByCategory && bill.isFilteredByBillType);
}

function getBillStatistics(bills: BillData[], categories: CategoryData[]): BillStatistic[] {
  const statistics: BillStatistic[] = [];
  const categories_for_paid: CategoryData[] = getCategoriesForPaid(categories);

  categories_for_paid.forEach((category: CategoryData) => {
    const billsForCategory = bills.filter((bill: BillData) => bill.category === category.id);
    if (billsForCategory.length > 0) {
      let amount = 0;
      billsForCategory.forEach((bill: BillData) => {
        amount += bill.amount;
      })

      statistics.push({category_name: category.name, amount})
    }
  })

  return getSortedStatistics(statistics);
}

function getCategoriesForPaid(categories: CategoryData[]): CategoryData[] {
    return categories.filter((category: CategoryData) => category.type === PAID);
}

function getSortedStatistics(statistics: BillStatistic[]) {
  return statistics.sort((a, b) => {
    return b.amount - a.amount;
  })
}

function getStatisticsAmount(statistics: BillStatistic[]): number {
  let amount = 0;
  statistics.forEach((statistic: BillStatistic) => {
    amount += statistic.amount;
  })

  return amount;
}

function cssClassNameForBillType(bill_type: number): string {
  if (bill_type === PAID) return "red";

  return "green";
}


export default Bills;
