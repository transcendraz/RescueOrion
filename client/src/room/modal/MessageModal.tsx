import React from 'react';
import styled from 'styled-components';

import {
  BaseModalTextBackground,
  BaseModalImageBackground,
  ExtraModal,
  Modal,
  ModalBackground,
  DismissButton,
  Header,
} from './modal';
import { Message } from '../../metadata/types';

const Body = styled.div`
  font-family: 'Roboto' sans-serif;
  font-size: 20px;
  font-weight: bold;
`;

const Note = styled.div`
  font-family: Orbitron;
  font-size: 20px;
  text-align: center;
  color: #b62021;
`;

const StyledModal = styled(Modal)`
  padding: 30px;
`;

export const StyledExtraModal = styled(ExtraModal)`
  padding: 20px;
`;

export const StyledDismissButton = styled(DismissButton)`
  display: flex;
  margin-left: auto;
`;

export const StyledDismissButtonForImageModal = styled(DismissButton)`
  position: absolute;
  right: 40px;
  bottom: 65px;
  width: 180px;
  height: 90px;
`;

export default (props: {
  message?: Message,
  onClose?: () => void,
}) => {

  return <ModalBackground> 
    {
      !props.message?.asset ?
      <BaseModalTextBackground>
        <StyledModal>
          <StyledDismissButton 
            data-testid="close-message-button"
            onClose={props.onClose} 
          />
          <Header data-testid="message-modal-header">
            {props.message?.title}
          </Header>
          <Body data-testid="message-modal-body">
            {
              props.message?.paragraphs.map((paragraph, i) => {
                return <p key={i}>
                  {paragraph.text}
                </p>;
              })
            }
          </Body>
        </StyledModal>
        {props.message?.technology?
          <StyledExtraModal>
            <Body>{props.message?.note}</Body>
            <Header>{props.message?.technology}</Header>
            {
              props.message?.sideNote? <Note>{props.message?.sideNote}</Note> : <></>
            }
          </StyledExtraModal> : <></>
        }
      </BaseModalTextBackground> :
      <BaseModalImageBackground backgroundImage={props.message?.asset}>
        <StyledDismissButtonForImageModal onClose={props.onClose} />
      </BaseModalImageBackground>
    }
  </ModalBackground>;
}