import React from 'react';
import {
  ModalBackground,
  BaseModalTextBackground,
  Modal
} from './modal';
import styled from 'styled-components';

const WaitMessage = styled.div`
  font-weight: bold;
  font-size: 24px;
  font-family: Orbitron;
`;

export default () => {
  return <ModalBackground>
    <BaseModalTextBackground>
      <Modal>
        <WaitMessage>Waiting for your commander to start mission...</WaitMessage>
      </Modal>
    </BaseModalTextBackground>
  </ModalBackground>;
}