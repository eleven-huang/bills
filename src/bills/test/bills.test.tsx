import React from 'react'
import { shallow, mount } from 'enzyme'

import Bills, {Props, CategoryData, BillData} from '.././bills'
import {getBillStatistics} from '.././statistics'
import {PAID} from '.././constants'
import {isTheRightMonth} from '.././reducer'

const props: Props = {
  bills: [
    {type: 0, amount: 5400, time: 1561910400000, category: "8s0p77c323", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 0, amount: 1500, time: 1561910400000, category: "0fnhbcle6hg", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 0, amount: 3900, time: 1563897600000, category: "3tqndrjqgrg", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 0, amount: 1900, time: 1564502400000, category: "bsn20th0k2o", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 0, amount: 5400, time: 1564588800000, category: "8s0p77c323", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 0, amount: 1500, time: 1564588800000, category: "0fnhbcle6hg", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 0, amount: 5000, time: 1564588800000, category: "3tqndrjqgrg", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 0, amount: 2000, time: 1566316800000, category: "bsn20th0k2o", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 0, amount: 5400, time: 1567267200000, category: "8s0p77c323", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 0, amount: 1500, time: 1567267200000, category: "0fnhbcle6hg", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 0, amount: 5400, time: 1577345576917, category: "8s0p77c323", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 0, amount: 3000, time: 1577345590283, category: "1bcddudhmh", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 0, amount: 3900, time: 1577345789527, category: "3tqndrjqgrg", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 0, amount: 5400, time: 1577548800000, category: "8s0p77c323", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 1, amount: 30000, time: 1561910400000, category: "s73ijpispio", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 1, amount: 1000, time: 1564502400000, category: "5il79e11628", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 1, amount: -3000, time: 1567094400000, category: "1vjj47vpd28", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 1, amount: 28000, time: 1567180800000, category: "s73ijpispio", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 1, amount: 28000, time: 1569772800000, category: "s73ijpispio", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 1, amount: 2000, time: 1569772800000, category: "1vjj47vpd28", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 1, amount: 20000, time: 1572451200000, category: "s73ijpispio", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 1, amount: 30000, time: 1577345267529, category: "s73ijpispio", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 1, amount: -10000, time: 1577345303191, category: "1vjj47vpd28", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 1, amount: 1000, time: 1577345317187, category: "5il79e11628", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 1, amount: 3000, time: 1577345463930, category: "s73ijpispio", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 1, amount: 2000, time: 1577345477581, category: "5il79e11628", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true},
    {type: 1, amount: 2000, time: 1577345638784, category: "1vjj47vpd28", isFilteredByMonth: true, isFilteredByBillType: true, isFilteredByCategory: true}
  ],
  categories: [
    {type: 0, id: "1bcddudhmh", name: "车贷"},
    {type: 0, id: "hc5g66kviq", name: "车辆保养"},
    {type: 0, id: "8s0p77c323", name: "房贷"},
    {type: 0, id: "0fnhbcle6hg", name: "房屋租赁"},
    {type: 0, id: "odrjk823mj8", name: "家庭用品"},
    {type: 0, id: "bsn20th0k2o", name: "交通"},
    {type: 0, id: "j1h1nohhmmo", name: "旅游"},
    {type: 0, id: "3tqndrjqgrg", name: "日常饮食"},
    {type: 1, id: "s73ijpispio", name: "工资"},
    {type: 1, id: "1vjj47vpd28", name: "股票投资"},
    {type: 1, id: "5il79e11628", name: "基金投资"}
  ]
}

const setupByShallow = () => {
  return shallow(<Bills {...props} />);
};

const setupByMount = () => {
  return mount(<Bills {...props} />);
};

describe("Bills", () => {
  describe("Initialize", () => {
    it('should renders correctly', () => {
        const wrapper = setupByShallow();
        expect(wrapper).toMatchSnapshot();
    });

    it('should renders all bills', () => {
        const wrapper = setupByMount();
        expectRendersRightBillList(wrapper, props.bills.length + 1);
    });

    it('should renders all filters', () => {
        const wrapper = setupByMount();
        expect(wrapper.find(".filter").length).toBe(3);
    })

    it('should renders statistics table', () => {
        const wrapper = setupByMount();
        expect(wrapper.find("table.statistics").exists()).toBe(true);

        expectRendersRightStatistics(wrapper, getBillStatistics(props.bills, props.categories).length + 1);
    })

    it('should renders add bill button', () => {
      const wrapper = setupByMount();
      expect(wrapper.find(".add-bill").exists()).toBe(true);
    })
  })

  describe("Filters", () => {
    it('should filter bills for the rigth category', () => {
      const wrapper = setupByMount();
      const category = props.categories[0];

      wrapper.find(".category-filter").find("button").simulate("click");
      wrapper.update();

      const option = wrapper.find(".category-filter").find(".dropdown").find(".dropdown-item").at(2);
      expect(option.props().children).toBe(category.name);

      option.simulate("click");
      wrapper.update();

      const bills = billsForCategoryId(category.id, props.bills);
      expectRightRendersForBills(wrapper, bills);
    })

    it('should filter bills for right type', () => {
      const wrapper = setupByMount();
      const PAID_NAME = "支出";
      wrapper.find(".bill-type-filter").find("button").simulate("click");
      wrapper.update();

      const option = wrapper.find(".bill-type-filter").find(".dropdown").find(".dropdown-item").at(2);
      expect(option.props().children).toBe(PAID_NAME);

      option.simulate("click");
      wrapper.update();

      const bills: BillData[] = billsForType(PAID, props.bills);
      expectRightRendersForBills(wrapper, bills);
    });

    it('should filters bills for right date', () => {
      const wrapper = setupByMount();

      const year = 2019;
      const month = 7;
      const index = 6;

      wrapper.find(".month-filter").find("input").simulate("click");
      wrapper.update();

      expect(wrapper.find(".month-filter").find(".react-datepicker-year-header").props().children).toBe(year);

      const options = wrapper.find(".month-filter").find(".react-datepicker__month-text");
      expect(options.get(index).props["children"]).toBe(`${month}月`)

      options.at(index).simulate("click");
      wrapper.update();

      const bills = billsForYearAndMonth(year, month, props.bills);
      expectRightRendersForBills(wrapper, bills);
    });
  })
})

function expectRightRendersForBills(wrapper: any, bills: BillData[]): void {
  expectRendersRightBillList(wrapper, bills.length + 1);
  expectRendersRightStatistics(wrapper, getBillStatistics(bills, props.categories).length + 1);
}

function billsForYearAndMonth(year: number, month: number, bills: BillData[]): BillData[] {
  return bills.filter((bill: BillData) => {
    return isTheRightMonth(bill, year, month);
  })
}

function billsForType(type: number, bills: BillData[]): BillData[] {
    return bills.filter((bill: BillData) => {
      return bill.type === type;
    })
}

function billsForCategoryId(category_id: string, bills: BillData[]): BillData[] {
  return bills.filter((bill: BillData) => {
    return bill.category === category_id;
  })
}

function expectRendersRightBillList(wrapper: any, table_rows: number): void {
  expect(wrapper.find(".bills > tbody > tr").length).toBe(table_rows);
}

function expectRendersRightStatistics(wrapper: any, table_rows: number): void {
  expect(wrapper.find(".statistics > tbody > tr").length).toBe(table_rows);
}
