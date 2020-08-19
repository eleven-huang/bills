import React, {} from 'react'
import {Container, Row, Col} from 'react-bootstrap'

type Props = {

}

type State = {
  error: any,
  errorInfo: any
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error: any, info: any) {
    this.setState({
      error: error,
      errorInfo: info
    });

    console.log(error);
    this.notifyServer(error, info);
  }

  notifyServer = (error: any, info: any) => {

  }

  render() {
    if (this.state.errorInfo) {

      return (
        <Container fluid="md">
          <Row>
            <Col lg={12}><h1>发生了错误</h1></Col>
            <Col lg={12}>
              {this.state.error && this.state.error.toString()}
            </Col>
          </Row>
        </Container>

      );
    }
    return this.props.children;
  }
}
