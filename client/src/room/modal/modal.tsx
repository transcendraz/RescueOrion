import React from 'react';
import styled from 'styled-components';

export const ModalBackground = styled.div`
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  position: absolute;
  margin: 0 auto;
  background-color: rgba(10, 10, 10, 0.2);
  z-index: ${(props: {zIndex?: Number|undefined }) => props.zIndex !== undefined ? `${props.zIndex}`: '10'};
`;

export const BaseModalBackground = styled.div`
  position: absolute;
  padding: 30px;
  top: 80px;
  width: 700px;
  left: 50%;
  transform: translate(-50%, 0);
`;

export const BaseModalImageBackground = styled(BaseModalBackground)`
  height: 500px;
  background-size: cover;
  background-image: ${(props: {backgroundImage: string|undefined }) => props.backgroundImage !== undefined ? `url("${process.env.PUBLIC_URL}/${props.backgroundImage}")`: 'none'};
`;

export const BaseModalTextBackground = styled(BaseModalBackground)`
`;

export const BaseModal = styled.div`
  background-color: white;
  padding: 30px;
  background-color: rgb(197, 205, 233);
  border-bottom: 5px solid #b62021;
  font-family: 'roboto';
`;

export const Modal = styled(BaseModal)`
  clip-path: polygon(25px 0, 100% 0, 100% calc(100% - 25px), calc(100% - 25px) 100%, 25% 100%, 0 100%, 0 25px);
  margin-bottom: 20px;
`;

export const ExtraModal = styled(BaseModal)`
  clip-path: polygon(0 0, calc(100% - 25px) 0, 100% 25px, 100% 100%, 25px 100%, 0 calc(100% - 25px), 0 0);
`;

export const StyledModal = styled(Modal)`
  padding: 30px;
`;

export const Header = styled.div`
  height: 40px;
  line-height: 40px;
  font-weight: bold;
  font-size: 28px;
  text-align: center;
  color: #b62021;
  font-family: Orbitron;
`;

export const Body = styled.div`
  font-family: 'Roboto' sans-serif;
  font-size: 20px;
  font-weight: 500;
`;

export const StyledButton = styled.div`
  font-family: 'Roboto' sans-serif;
  cursor: pointer;
  background-size: cover;
  width: 130px;
  height: 65px;
  background-image: url(${`"${process.env.PUBLIC_URL}/buttons/Map Buttons_outlines_Dismiss.png"`});
`;

export function DismissButton(props: {
  onClose?: () => void,
  className?: string,
}) {
  return <StyledButton
    onClick={props.onClose}
    className={props.className}
  />;
}
