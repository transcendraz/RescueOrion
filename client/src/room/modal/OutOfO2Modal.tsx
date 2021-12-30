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
          <p>Oh no! It appears you were too late.</p>
          <p>The oxygen systems were not permanently fixed in time and the worst has happened. All of the scientists on Space Station Orion have passed away and have taken their place amongst the stars!</p>
          <p>While we may not have successfully complete our mission, let’s have a discussion, where did we go wrong? What could we have done differently.</p>
          <p>-Ground Control</p>
        </Body>
      </StyledModal>
      <StyledExtraModal>
        <EndGameStatsModal />
      </StyledExtraModal>    
    </BaseModalBackground>
  </ModalBackground>
}