import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Jumbotron, Button, Col, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const Global = createGlobalStyle`
  html, body {
    background-color: rgb(248, 248, 248) !important;
  }
`;

const Wrapper = styled(Jumbotron)`
  margin: 50px auto;
  width: 500px;
`;

export default () => {

  const history = useHistory();

  return <>
    <Global />
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
      integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
      crossOrigin='anonymous'
    />
    <Wrapper>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '20px',
      }}>
        Welcome to Rescue Orion
      </h2>
      <p style={{
        textAlign: 'center',
        marginBottom: '35px',
      }}>
        Are you an admin or a player?
      </p>
      <Row>
        <Col>
          <Button
            onClick={() => history.push('/admin')}
            variant='info'
            block
          >Admin</Button>
        </Col>
        <Col>
          <Button
            onClick={() => history.push('/join')}
            variant='success'
            block
          >Player</Button>
        </Col>
      </Row>
    </Wrapper>  
  </>;
}