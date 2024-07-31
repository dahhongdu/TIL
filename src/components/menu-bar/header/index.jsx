import { Link } from "gatsby";
import React from "react"
import styled from "styled-components";
import { useLocation } from "@reach/router";
import { siteMetadata } from "../../../../gatsby-config";
import ThemeSwitch from "../../theme-switch";
import { menuItems } from "../../../constants/headerLists";

const HeaderMenuBar = () => {
    const location = useLocation();

    return (
        <NavigatorWrapper>
            <Link style={{ textDecoration: "none" }} to="/">
                <Title>{siteMetadata.title}</Title>
            </Link>
            <MenuContainer>
                {menuItems.slice(1).map((item, index) => (
                    <MenuItem key={index} {...item} active={location.pathname === item.to} />
                ))}
                {menuItems.slice(0, 1).map((item, index) => (
                  <MenuItem key={index} {...item} active={location.pathname === item.to} />
              ))}
              <ThemeSwitch/>
            </MenuContainer>
        </NavigatorWrapper>
    )
}

const MenuItem = ({ to, icon, text, showText }) => {
    const location = useLocation();
    const isActive = to === '/' ? location.pathname === to : location.pathname.startsWith(to);
  
    return (
      <Link to={to} style={{ textDecoration: 'none' }}>
        <SideMenu active={isActive}>
          {!showText && icon}
          {showText && text}
        </SideMenu>
      </Link>
    );
};

const Title = styled.header`
  font-size: 1.5rem;
  color: ${props => props.theme.main.text};
  font-weight: bold;
  margin-left: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const NavigatorWrapper = styled.div`
  position: fixed;
  display: flex;
  justify-content: space-between;
  border-bottom: 2.5px solid ${props => props.theme.menuBar.border};
  width: 100%;
  background-color: ${props => props.theme.menuBar.wrapper};
  z-index: 1000;
  opacity: 0.7;

  @media(max-width: 768px) {
    left: 0px;
  }
`;

const MenuContainer = styled.div`
  display: flex;
  margin-right: 1rem;
  align-items: center;
`;

const SideMenu = styled.span`
  margin-right: 13px; 
  color: ${props => props.theme.main.text};
  transition: background-color 0.2s ease-in-out;
`;

export default HeaderMenuBar;
