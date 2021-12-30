import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import client from '../axios-client';
import { Jumbotron, Table, Button, Modal } from 'react-bootstrap';
import { PortalGlobal, Title, Wrapper, NavBar } from './styles';
import styled from 'styled-components';
import { localeTimeString } from '../time-format-utils';
import { API_BASE_URL } from '../config';

const TableCell = styled.td`
  &:hover {
    cursor: pointer;
  }
`;

const HighlightableRow = styled.tr`
  background-color: ${(props: { highlight: boolean }) =>
    props.highlight ? '#fff2a8' : 'auto'
  };
`;

export default () => {

  const history = useHistory();
  const [lobbies, setLobbies] = useState<{ code: number, createTime: number }[]>([]);
  const [deleteModal, setDeleteModal] = useState<number>();
  const [newLobby, setNewLobby] = useState<number>();
  const [newLobbyDisplayTimeout, setNewLobbyDisplayTimeout] = useState<number>();

  useEffect(loadLobbies, []);

  function loadLobbies() {
    client.get(`${API_BASE_URL}/lobbies`,
      { headers: { Authorization: `bearer ${localStorage.getItem('token')}` }}
    )
      .then((res) => {
        setLobbies(res.data);
      });
  }

  function createLobby() {
    client.post(`${API_BASE_URL}/lobbies`, {}, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    })
      .then((res) => {
        setNewLobby(res.data.code);
        loadLobbies();
        clearTimeout(newLobbyDisplayTimeout);
        const timeout = setTimeout(() => setNewLobby(undefined), 5000);
        setNewLobbyDisplayTimeout(timeout);
      });
  }

  function deleteLobby(code: number) {
    client.delete(`${API_BASE_URL}/lobbies/${code}`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    })
      .then(() => {
        setDeleteModal(undefined);
        loadLobbies();
      });
  }

  function navigateToLobby(code: number) {
    history.push(`/admin/lobbies/${code}`);
  }
  
  return <>
    <PortalGlobal />
    <NavBar />
    <Wrapper>
      <Jumbotron>
        <Title>Welcome, {localStorage.getItem('username')}</Title>
        <h5 style={{ textAlign: 'center' }}>The table below contains the list of lobbies you are in charge of...</h5>
      </Jumbotron>
      <Button
        style={{ margin: '0 15px 15px 0' }}
        onClick={createLobby}
      >Create Lobby</Button>
      <Table striped bordered hover size='sm'>
        <tbody>
          <tr>
            <th>Lobby Code</th>
            <th>Create Time</th>
            <th style={{ width: '110px'}}>Close Lobby</th>
          </tr>
          {
            lobbies.map((lobby, index) => {
              const timeString = localeTimeString(lobby.createTime);
              return <HighlightableRow
                key={index}
                highlight={newLobby === lobby.code}
              >
                <TableCell onClick={() => navigateToLobby(lobby.code)}>{lobby.code}</TableCell>
                <td>{timeString}</td>
                <td style={{ textAlign: 'center', padding: '0.1em' }}>
                  <Button
                    size='sm'
                    variant='outline-danger'
                    onClick={() => setDeleteModal(lobby.code)}
                    >Shut Down</Button>
                </td>
              </HighlightableRow>;
            })
          }
        </tbody>
      </Table>
    </Wrapper>
    <Modal
      show={deleteModal !== undefined}
      onHide={() => setDeleteModal(undefined)}
    >
      <Modal.Header closeButton>
        <h4>About to shut down lobby {deleteModal}</h4>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure to shutdown lobby {deleteModal}?</p>
        <p>It cannot be undone and all games in it will be lost.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='secondary'
          onClick={() => setDeleteModal(undefined)}
        >Cancel</Button>
        <Button
          variant='danger'
          onClick={() => deleteLobby(deleteModal!)}
        >Yes, shut it down</Button>
      </Modal.Footer>
    </Modal>
  </>;
}