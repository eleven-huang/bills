import React, {useState} from 'react'
import {BillData, CategoryData, getBillTypeName} from './bills'
import {Modal, Button, Form} from 'react-bootstrap'
import {NO_CATEGORY} from './constants'

type Props = {
  categories: CategoryData[],
  billAdded: (bill: BillData) => void
}

type CategoryOption = {
  id: string,
  name: string
}

const AddBill: React.FunctionComponent<Props> = (props): JSX.Element => {

  const [show, setShow] = useState(false);

  const [amount, setAmount] = useState<number>();
  const [date, setDate] = useState<string>();
  const [category, setCategory] = useState<string>();
  const [typeName, setTypeName] = useState<string>("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isDisableAddButton = (): boolean => {
    return !(amount && date && category && typeName );
  }

  const handleCategoryChange = (category_name: string): void => {
    if (category_name === NO_CATEGORY) {
      setCategory(undefined);
      setTypeName("");
    } else {
      setCategory(category_name);
      const type = getCategoryTypeForName(category_name, props.categories);
      setTypeName(getBillTypeName(type));
    }
  }

  const add = (): void => {
    if (amount && date && category && typeName) {
      const category_id = getCategoryIdForName(category, props.categories);
      const type = getCategoryTypeForName(category, props.categories);
      const time = (new Date(date)).getTime();
      const [isFilteredByMonth, isFilteredByBillType, isFilteredByCategory] = [true, true, true];

      props.billAdded({amount, category: category_id, type, time, isFilteredByMonth, isFilteredByBillType, isFilteredByCategory});

      setShow(false);
    }
  }

  return(
    <span>
      <Button variant="dark" onClick={handleShow}>
        添加账单
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>添加账单</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>金额</Form.Label>
            <Form.Control type="number" placeholder="" onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAmount(parseFloat(event.target.value))} autoFocus/>
          </Form.Group>
          <Form.Group>
            <Form.Label>日期</Form.Label>
            <Form.Control type="datetime-local" placeholder="" onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDate(event.target.value)} />
          </Form.Group>
          <Form.Group>
          <Form.Label>分类</Form.Label>
          <Form.Control as="select" defaultValue="" onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleCategoryChange(event.target.value)}>
            {getListCategoryOptions(props.categories)}
          </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>类型</Form.Label>
            <Form.Control type="text" placeholder="" value={typeName} readOnly/>
          </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose}>
            关闭
          </Button>
          <Button variant="dark" onClick={add} disabled={isDisableAddButton()}>
            添加
          </Button>
        </Modal.Footer>
      </Modal>
    </span>
  )
}

function getListCategoryOptions(categories: CategoryData[]) {
  const listCategoryOptions = categories.map((category: CategoryData) => {
    return (
      <option key={category.id}>{category.name}</option>
    )
  })

  listCategoryOptions.splice(0, 0, <option key={NO_CATEGORY}>{NO_CATEGORY}</option>);

  return listCategoryOptions;
}

function getCategoryTypeForName(name: string, categories: CategoryData[]): number {
  const category: CategoryData | undefined = categories.find((category: CategoryData) => category.name === name);
  if (category === undefined) {
    throw new Error("账单数据出错，请联系客服处理。");
  }

  return category.type;
}

function getCategoryIdForName(name: string, categories: CategoryData[]): string {
  const category: CategoryData | undefined = categories.find((category: CategoryData) => category.name === name);
  if (category === undefined) {
    throw new Error("账单数据出错，请联系客服处理。");
  }

  return category.id;
}

export default AddBill;
