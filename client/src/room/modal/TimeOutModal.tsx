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
          Attention, Gemini crew.
        </Header>
        <Body>
          <p>Time has unfortunately expired on your mission to rescue Orion. </p>
          <p>Our command team will continue to work to save the space station, but you are needed back at the command center. </p>
          <p>Buckle up; we are about to beam you back to meet with the Space Commander so we can debrief your mission. </p>
          <p>-Ground Control </p>
        </Body>
      </StyledModal>
      <StyledExtraModal>
        <EndGameStatsModal />
      </StyledExtraModal>    
    </BaseModalBackground>
  </ModalBackground>
}