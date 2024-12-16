import React from 'react'
import { StyledDisplay } from './styles/StyledDisplay';

const Display = ({gameover,text}) =>(
    <StyledDisplay gameover={gameover}>{text}</StyledDisplay>
  )


export default Display;