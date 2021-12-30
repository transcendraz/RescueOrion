import React from 'react';
import {
  BaseModalBackground,
  ModalBackground,
  Header,
  Body,
  StyledModal
} from './modal';
import { StyledExtraModal } from './MessageModal';
import styled from 'styled-components';
import EndGameStatsModal from './EndGameStatsModal';

const SuccessModalBackground = styled(ModalBackground)`
  background-image: url(${process.env.PUBLIC_URL}/game_success_map.png);
  background-size: contain;
`;

export default () => {
  return <SuccessModalBackground>
    <BaseModalBackground>
      <StyledModal>
        <Header>
          Welcome back to Sagittarius!
        </Header>
        <Body>
          <p>We are so excited to hear the tales of your successful mission!</p>
          <p>When you are ready, please call in the Space Commander to come and congratulate you personally!</p>
          <p>Thank you for all you did to Rescue Orion!</p>
          <p>-Ground Control </p>
        </Body>
      </StyledModal>
      <StyledExtraModal>
        <EndGameStatsModal />
      </StyledExtraModal>      
    </BaseModalBackground>
  </SuccessModalBackground>;
}