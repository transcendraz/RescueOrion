import '@testing-library/jest-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

describe('/admin/login endpoint', () => {
  it('allows sign in correctly', (done) => {
    axios.post(`${API_BASE_URL}/admin/login`, {
      username: 'LobbyTest',
      password: 'randompasswordfortesting1023',
    })
      .then((res) => {
        expect(res.data?.token).toBeDefined();
        done();
      })
      .catch((err) => done(err));
  });

  it('rejects incorrect password', (done) => {
    axios.post(`${API_BASE_URL}/admin/login`, {
      username: 'LobbyTest',
      password: 'randompasswordfortesting123',
    })
      .then((res) => {
        expect(res.data?.token).toBeDefined();
        done(new Error('Should not be authenticated'));
      })
      .catch((err) => {
        if (err.response) {
          expect(err.response.data).toMatch('Wrong password for user: LobbyTest');
          done();
        } else {
          done(err);
        }
      });
  });

  it('rejects incorrect username', (done) => {
    axios.post(`${API_BASE_URL}/admin/login`, {
      username: 'LobbyTesttt',
      password: 'randompasswordfortesting123',
    })
      .then((res) => {
        expect(res.data?.token).toBeDefined();
        done(new Error('Should not be authenticated'));
      })
      .catch((err) => {
        if (err.response) {
          expect(err.response.data).toMatch('Unauthorized user: LobbyTesttt');
          done();
        } else {
          done(err);
        }
      });
  });
});