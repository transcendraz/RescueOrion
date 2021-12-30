  
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect'
import { shallow, mount } from 'enzyme';
import React from 'react';
import { useHistory } from 'react-router-dom';
import AdminLogin from '../admin/Login'
import { createBrowserHistory } from "history"
import axios from 'axios';
import { API_BASE_URL } from '../config';

const history = createBrowserHistory();
const user = {
    username: "LobbyTest",
    password: "randompasswordfortesting1023",
    error: "",
  };

describe('Admin page', () => {
    it('renders without crashing', () => {
      const wrapper = shallow(<AdminLogin history={history}/>);
      //console.log(wrapper.debug());
      const title = wrapper.find("h3").text();
      expect(title).toEqual("Sign In to Manage Rescue Orion");

      const Button = wrapper.find("Button").text();
      expect(Button).toEqual("Sign In");
});

  it('should render admin login page', () => {
    const { getByText } = render(<AdminLogin history={history}/>);
    expect(getByText('Sign In to Manage Rescue Orion')).toBeInTheDocument();
    expect(getByText('Username')).toBeInTheDocument();
    expect(getByText('Password')).toBeInTheDocument();
    expect(getByText('Sign In')).toBeInTheDocument();
  });

  it('should display error message when username and password are empty', () => {
    const { getByText } = render(<AdminLogin history={history}/>);
    fireEvent.click(screen.getByText('Sign In'));
    expect(getByText('Username and password must not be empty.')).toBeInTheDocument();
  });

  it('allows sign in correctly', (done) => {
    axios.post(`${API_BASE_URL}/admin/login`, {
      username: 'RoomTest',
      password: 'randompasswordfortesting1023',
    })
      .then((res) => {
        expect(res.data?.token).toBeDefined();
        done();
      })
      .catch((err) => done(err));
  });
});