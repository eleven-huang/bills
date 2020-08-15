import React from 'react';
import * as d3 from 'd3-fetch'

type BillData = {
  time: string,
  type: string,
  category: string,
  amount: string,
}

type CategoryData = {
  id: string,
  type: string,
  name: string
}

type Props = {

}

type State = {
  categories: CategoryData[]
  bills: BillData[],
}


export default class Bills extends React.Component<Props, State> {
    public readonly state: Readonly<State> = {
      bills: [],
      categories: []
    }

    componentDidMount() {
      getData(this);
    }

    render(): JSX.Element {
      const listBills = this.state.bills.map((bill: BillData, index: number) => {
          const category = getCategoryById(this.state.categories, bill.category);

          return(
            <div key={index}>
              <span>{bill.amount}</span>
              <span>{category.name}</span>
            </div>
          )
      });

      return (
        <div>{listBills}</div>
      )
    }
}

function getData(billsComponent: React.Component) {
  //get categories first
  var csv_file_path = require("./data/bill_categories.csv");
  d3.csv(csv_file_path).then(function(data) {
    billsComponent.setState({categories: data});
    
    getBills(billsComponent);
  });
}

function getBills(billsComponent: React.Component) {
  var csv_file_path = require("./data/bills.csv");
  d3.csv(csv_file_path).then(function(data) {
    billsComponent.setState({bills: data})
  });
}

function getCategoryById(categories: CategoryData[], id: string): CategoryData {
  const category: CategoryData | undefined = categories.find((category: CategoryData) => category.id === id);
  if (category === undefined) {
      throw new Error("Wrong categories or bills data");
  }

  return category;
}
