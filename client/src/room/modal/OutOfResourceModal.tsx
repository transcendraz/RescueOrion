import React from 'react';
import EndGameStatsModal from './EndGameStatsModal';

import {
  BaseModalBackground,
  ModalBackground,
  Header,
  Body,
  StyledModal,
} from './modal';
import { StyledExtraModal } from './MessageModal';

export default () => {
  return <ModalBackground zIndex={1}>
    <BaseModalBackground>
      <StyledModal>
        <Header>
          Incoming Relay From Ground Control
        </Header>
        <Body>
          <p>Oh no! Your ship ran out of the resources required to keep your ship moving so you can carry out your mission!</p>
          <p>Please send a distress call to the Space Commander and we will provide further instruction.</p>
          <p>-Ground Control</p>
        </Body>
      </StyledModal>
      <StyledExtraModal>
        <EndGameStatsModal />
      </StyledExtraModal>    
    </BaseModalBackground>
  </ModalBackground>
}