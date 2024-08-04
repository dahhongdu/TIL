import { Link } from 'gatsby';
import React from 'react';
import styled from 'styled-components';

const IconWrapper = styled.div`
  opacity: 0.6; 
  transition: opacity 0.3s ease; 
  
  &:hover {
    opacity: 1; 
  }
`;

const IconBtn = ({url, icon}) => {
  return ( 
    <Link to={url}>
      <IconWrapper>
        {icon}
      </IconWrapper>
    </Link>
  );
}

export default IconBtn;