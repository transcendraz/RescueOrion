import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import {
  Jumbotron,
  InputGroup,
  FormControl,
  Button,
} from 'react-bootstrap';
import { History } from 'history';
import { API_BASE_URL } from '../config';

const Global = createGlobalStyle`
  html, body {
    background-color: rgb(248, 248, 248) !important;
  }
`;

const Wrapper = styled(Jumbotron)`
  margin: 50px auto;
  width: 500px;
`;

export default class extends React.Component<{
    history: History,
  }, {
    username: string,
    password: string,
    error?: string,
}> {
  constructor(props:any){
    super(props);
    this.state = {
      username:'',
      password:'',
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  handleUsernameChange(event: { target: { value: any; }; }){
    this.setState({username: event.target.value});
  }
  handlePasswordChange(event: { target: { value: any; }; }){
    this.setState({password: event.target.value});
  }

  onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      this.handleFormSubmit();
    }
  }

  async handleFormSubmit() {
    if (!this.state.username || !this.state.password) {
      this.setState({ error: 'Username and password must not be empty.'});
      return;
    }
    try {
      const { data } = await axios.post(`${API_BASE_URL}/admin/login`, {
        username: this.state.username,
        password: this.state.password,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', this.state.username);
      this.props.history.push('/admin/lobbies');
    } catch (err) {
      this.setState({ error: err.response?.data ?? 'Cannot connect to server.' });
    }
  }

  render() {
    return <>
      <Global />
      <Wrapper>
        <h3 style={{
          textAlign: 'center',
          marginBottom: '40px',
        }}>Sign In to Manage Rescue Orion</h3>
        <InputGroup style={{ marginBottom: '10px' }}>
          <InputGroup.Prepend>
            <InputGroup.Text
              style={{
                width: '100px',
                backgroundColor: 'rgb(73, 81, 87)',
                color: 'white',
              }}
            >Username</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl 
            value={this.state.username}
            onChange={this.handleUsernameChange}
            onKeyDown={this.onKeyDown}
          />
        </InputGroup>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text
              style={{
                width: '100px',
                backgroundColor: 'rgb(73, 81, 87)',
                color: 'white',
              }}
            >Password</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            type="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
            onKeyDown={this.onKeyDown}
          />
        </InputGroup>
        <p style={{ height: '20px', color: 'red' }}>
          {this.state.error}
        </p>
        <Button
          onClick={this.handleFormSubmit}
          block
        >Sign In</Button>
      </Wrapper>
    </>;
  }
}
