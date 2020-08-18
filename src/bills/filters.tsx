import React, {useState} from 'react'
import {CategoryData} from './bills'
import {Dropdown} from 'react-bootstrap'
import {ALL, ALL_BILL_TYPE, PAID, RECEIVED} from './constants'

import DatePicker, { registerLocale }  from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import zh from "date-fns/locale/zh-CN"
registerLocale("zh-CN", zh);

export type CategoryOption = {
    id: string,
    name: string
}

export type BillTypeOption = {
  type: number,
  name: string
}

export type Props = {
  categories: CategoryData[],
  selectDate: (date: any) => void,
  selectCategoryOption: (option: CategoryOption) => void,
  selectBillTypeOption: (option: BillTypeOption) => void
}


const Filters: React.FunctionComponent<Props> = (props): JSX.Element => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedCategoryOption, setSelectedCategoryOption] = useState<CategoryOption>();
  const [selectedBillTypeOption, setSelectedBillTypeOption] = useState<BillTypeOption>();

  const selectDate = (date: any): void => {
    setSelectedDate(date);
    props.selectDate(date);
  }

  const selectCategoryOption = (option: CategoryOption): void => {
    setSelectedCategoryOption(option);
    props.selectCategoryOption(option);
  }

  const getListCategoryOptions = (): JSX.Element => {
    const categoryOptions: CategoryOption[] = getCategoryOptions(props.categories);
    const listCategoryOptions: any = [];
    categoryOptions.forEach((option: CategoryOption) => {
      listCategoryOptions.push(<Dropdown.Item key={option.id} onClick={() => selectCategoryOption(option)}>{option.name}</Dropdown.Item>);
    });

    return listCategoryOptions;
  }

  const selectBillTypeOption = (option: BillTypeOption): void => {
    setSelectedBillTypeOption(option);
    props.selectBillTypeOption(option);
  }

  const getListBillTypeOptions = (): JSX.Element => {
    const billTypeOptions: BillTypeOption[] = getBillTypeOptions();
    const listBillTypeOptions: any = [];
    billTypeOptions.forEach((option: BillTypeOption) => {
      listBillTypeOptions.push(<Dropdown.Item key={option.type} onClick={() => selectBillTypeOption(option)}>{option.name}</Dropdown.Item>);
    })

    return listBillTypeOptions;
  }

  return(
    <span className="filters">
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
    </span>
  )
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


export default Filters;
