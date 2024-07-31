import { Link } from "gatsby";
import React from "react";
import styled from "styled-components";

const PageFooter = () => {
  return (
    <PageFooterWrapper>
      <Text>Ⓒ 2024, </Text>
      <StyledLink to="https://github.com/dahhongdu">
        dahhongdu
      </StyledLink>
    </PageFooterWrapper>
  );
};

const Text = styled.span`
  margin-right: 5px;
  color: gray;
`;

const StyledLink = styled(Link)`
  color: ${props => props.theme.post.content.text};
`;

const PageFooterWrapper = styled.footer`
  margin-top: 120px;
  padding-bottom: 60px;
  text-align: center;
  font-size: 13.5px;
  color: gray;
  height: 30px;
  position: relative;
  /* transform: translateY(-100%); */
`;

export default PageFooter;
