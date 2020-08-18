import React, {useState, useMemo} from 'react';
import logo from './logo.svg';
import './App.css';
import Bills, {BillData, CategoryData} from './bills/bills'
import Header from './header/header'
import * as d3 from 'd3-fetch'

const App: React.FunctionComponent = (): JSX.Element => {
  const [bills, setBills] = useState<BillData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  const getDataForBillsComponent = (): void => {
    //get categories first
    var csv_file_path = require("./bills/data/bill_categories.csv");
    d3.csv(csv_file_path).then(function(data) {
      const categories = getConstructedCategoryData(data);
      setCategories(categories);
      getBills();
    });
  };

  const getBills = (): void => {
    var csv_file_path = require("./bills/data/bills.csv");
    d3.csv(csv_file_path).then(function(data) {
      const bills: BillData[] = getConstructedBillData(data);
      setBills(bills);
    });
  }

  useMemo(() => {
    getDataForBillsComponent();
  }, [])

  return (
    <div className="App">
      <Header />
      <Bills bills={bills} categories={categories}/>
    </div>
  );
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
    const [isFilteredByMonth, isFilteredByBillType, isFilteredByCategory] = [true, true, true];

    bills.push({type, amount, time, category: bill.category, isFilteredByMonth, isFilteredByCategory, isFilteredByBillType});
  })

  return bills;
}

export default App;
