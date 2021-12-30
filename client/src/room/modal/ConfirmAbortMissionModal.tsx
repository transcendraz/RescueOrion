import React from 'react';
import {
  BaseModalImageBackground,
  ModalBackground,
} from './modal';
import { useDispatch } from '../redux-hook-adapters';
import { abortMission } from '../actions';
import styled from 'styled-components';

const AbortButton = styled.div`
  position: absolute;
  top: 20px;
  left: 120px;
  cursor: pointer;
  height: 70px;
  width: 140px;
  background-size: cover;
  background-image: url(${`"${process.env.PUBLIC_URL}/buttons/Map Buttons_outlines_Yes.png"`});
`;

const CancelButton = styled.div`
  position: absolute;
  right: 180px;
  top: 20px;
  cursor: pointer;
  height: 70px;
  width: 140px;
  background-size: cover;
  background-image: url(${`"${process.env.PUBLIC_URL}/buttons/Map Buttons_outlines_No.png"`});
`;

export default (props: {
  onClose: () => void,
}) => {

  const dispatch = useDispatch();

  return <ModalBackground>
    <BaseModalImageBackground backgroundImage='modals/Rescue Orion POP UP SCREEN_For USC_22.png'>
      <div style={{
        position: 'relative',
        marginTop: '280px',
      }}>
        <AbortButton
          data-testid="abort-mission-confirm"
          onClick={() => {
            dispatch(abortMission());
            props.onClose();
          }}
        />
        <CancelButton
          data-testid="abort-mission-cancel"
          onClick={props.onClose}
        />
      </div>
    </BaseModalImageBackground>
  </ModalBackground>;
}