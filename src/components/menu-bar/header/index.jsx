import { Link } from "gatsby";
import React from "react"
import styled from "styled-components";
import { useLocation } from "@reach/router";
import { MdOutlineDarkMode } from "react-icons/md";
import { siteMetadata } from "../../../../gatsby-config";
import { IoSearch } from "react-icons/io5";
import { FaBook } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaCommentAlt, FaTags  } from "react-icons/fa";
import ThemeSwitch from "../../theme-switch";

const menuItems = [
  { to: '/search', icon: <IoSearch className="icon" size="23" />, text: '', showText: false },
  { to: '/tags', icon: <FaTags className="icon" size="23" />, text: 'Tags', showText: true },
  { to: '/series', icon: <FaBook className="icon" size="23" />, text: 'Series', showText: true },
  { to: '/about', icon: <BsFillPeopleFill className="icon" size="23" />, text: 'About', showText: true },
  { to: '/community', icon: <FaCommentAlt className="icon" size="23" />, text: 'Community', showText: true },
];

const HeaderMenuBar = () => {
    const location = useLocation();

    return (
        <NavigatorWrapper>
            <Link style={{ textDecoration: "none" }} to="/">
                <Title>{siteMetadata.title}</Title>
            </Link>
            <MenuContainer>
                {menuItems.slice(0, 1).map((item, index) => (
                    <MenuItem key={index} {...item} active={location.pathname === item.to} />
                ))}
                <ThemeSwitch/>
                {menuItems.slice(1).map((item, index) => (
                    <MenuItem key={index} {...item} active={location.pathname === item.to} />
                ))}
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
  font-size: 24px;
  color: ${props => props.theme.main.text};
  font-weight: bold;
  margin-left: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const NavigatorWrapper = styled.div`
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2.5px solid ${props => props.theme.menuBar.border};
  width: 100%;
  background-color: ${props => props.theme.menuBar.wrapper};
  z-index: 1000;

  @media(max-width: 768px) {
    left: 0px;
  }
`;




const MenuContainer = styled.div`
  display: flex;
  margin-right: 20px;
  max-width: 42%;
  align-items: center;
`;

const SideMenu = styled.span`
  margin-right: 13px; 
  color: ${props => props.theme.main.text};
  transition: background-color 0.2s ease-in-out;
`;

export default HeaderMenuBar;
