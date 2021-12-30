import styled from 'styled-components';

export default styled.div`
  width: 0;
  height: 0;
  text-indent: -9999px;
  border-top: 12px solid transparent;
  border-left: ${(props: { disabled?: boolean }) => 
    props.disabled ?
    '36px solid grey' : '36px solid red'
  };
  
  border-bottom: 12px solid transparent;
  cursor: pointer;
`;