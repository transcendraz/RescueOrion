import styled, { createGlobalStyle } from 'styled-components';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';

export const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: rgb(248, 248, 248);
  padding: 20px;
  padding-top: 75px;
`;

export const Title = styled.h1`
  margin-bottom: 30px;
  text-align: center;
`

const StyledLink = styled(Link)`
  color: #cccccc;
  &:hover {
    color: white;
    text-decoration: none;
  }
  padding: 5px;
`;

export const PortalGlobal = createGlobalStyle`
  html, body {
    background-color: rgb(233, 233, 233) !important;
  }
`;

export class NavBar extends Component{
  render() {
    return (
      <Navbar fixed="top" bg="dark" variant="dark">
        <Nav className="mr-auto">
          <StyledLink to="/admin/lobbies">Return to Lobby List</StyledLink>
        </Nav>
        <Nav>
          <StyledLink to="/admin" onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
          }}>Log Out</StyledLink>
        </Nav>
      </Navbar>
    );
  }
}
