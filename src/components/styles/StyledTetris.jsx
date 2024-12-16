import styled from 'styled-components';
// BG Image
import bgImage from '../../img/bg.png';

export const StyledTetrisWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: url(${bgImage}) #100;
  background-size: cover;
  overflow: hidden;
`;

export const StyledTetris = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 40px;
  margin: 0 auto;
  max-width: 1000px;

  aside {
    width: 100%;
    max-width: 250px;
    display: block;
    padding: 0 20px;
  }
`;