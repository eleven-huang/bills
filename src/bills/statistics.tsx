import React from 'react'
import {BillData, CategoryData, PAID} from './bills'
import {Table} from 'react-bootstrap'


export type BillStatistic = {
  category_name: string,
  amount: number
}

export type Props = {
    bills: BillData[],
    categories: CategoryData[]
}

const Statistics: React.FunctionComponent<Props> = (props): JSX.Element => {

  const getListStatistics = (bills: BillData[]): JSX.Element => {
    const statistics: BillStatistic[] = getBillStatistics(props.bills, props.categories);
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
      <tr key="">
        <td colSpan={4}>
          <strong><span className="red">总计:</span> {getStatisticsAmount(statistics)} </strong>
        </td>
      </tr>
    );

    return listStatistics;
  }

  return (
      <div>
        <h4><span className="red">支出</span>分类统计</h4>
        <Table className="statistics" striped bordered hover>
          <thead>
            <tr>
              <th>分类</th>
              <th>金额汇总</th>
            </tr>
          </thead>
          <tbody>
            {getListStatistics(props.bills)}
          </tbody>
        </Table>
      </div>
  )
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

export default Statistics;
