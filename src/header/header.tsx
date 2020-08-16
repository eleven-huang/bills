import React from 'react';
import {Navbar, Nav} from 'react-bootstrap'

const Header: React.FunctionComponent = (): JSX.Element => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/">
        <img
          alt=""
          src="/favicon.ico"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{' '}
        BILLS
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          <Nav.Link href="/">home</Nav.Link>
        </Nav>

      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header;
