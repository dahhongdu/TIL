import React from "react";
import styled from "styled-components";
import { useLocation } from "@reach/router";
import { Link } from "gatsby";
import { siteMetadata } from "../../../../gatsby-config";
import { IoSearch, IoHome } from "react-icons/io5";
import { FaBook } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { GiPartyPopper } from "react-icons/gi";
import { FaTags  } from "react-icons/fa";
import ThemeSwitch from "../../theme-switch";

const menuItems = [
  { to: '/search', icon: <IoSearch className="icon" size="23" />, text: '', showText: false },
  { to: '/tags', icon: <FaTags className="icon" size="23" />, text: 'Tags', showText: true },
  { to: '/series', icon: <FaBook className="icon" size="23" />, text: 'Series', showText: true },
  { to: '/about', icon: <BsFillPeopleFill className="icon" size="23" />, text: 'About', showText: true },
  { to: '/community', icon: <GiPartyPopper className="icon" size="23" />, text: '방명록', showText: true },
];

const AsideMenuBar = () => {
  const location = useLocation();

  return (
    <SideMenuBarStyle>
      <Link to={"/"} style={{ textDecoration: 'none' }}>
        <Title>{siteMetadata.title}</Title>
      </Link>
      <div>
        {menuItems.slice(0, 1).map((item, index) => (
          <MenuItem key={index} {...item} active={location.pathname === item.to} />
        ))}
        <ThemeSwitch />
        {menuItems.slice(1).map((item, index) => (
          <MenuItem key={index} {...item} active={location.pathname === item.to} />
        ))}
      </div>
    </SideMenuBarStyle>
  );
};

const MenuItem = ({ to, icon, text }) => {
  const location = useLocation();
  const isActive = to === '/' ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <SideMenu active={isActive}>
        {icon}
        <MenuText>{text}</MenuText>
      </SideMenu>
    </Link>
  );
};

const SideMenuBarStyle = styled.div`
  position: fixed;
  left: 0;
  height: 100%;
  max-width: 210px;
  margin-left: 30px;
  padding-right: 10px;
  background: ${props => props.theme.menuBar.wrapper};
  color: ${props => props.theme.main.text};
  z-index: 10;

  @media (max-width: 1300px) {
    display: none;
  }
`;

const SideMenu = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  padding: 10px;
  color: ${props => props.theme.main.text};
  font-size: 16px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease-in-out;
  border-radius: 8px;
  background-color: ${(props) => (props.active ? props.theme.menuBar.sideMenu : "transparent")};

  &:hover {
    background-color: ${(props) => (props.active ? props.theme.menuBar.sideMenu : props.theme.menuBar.sideMenuHover)};
  }
`;

const MenuText = styled.p`
  margin-left: 10px;
  margin-right: 30px;
  font-size: 16px;
`;

const Title = styled.div`
  font-size: 32px;
  color: ${props => props.theme.main.text};
  margin-top: 30px;
  margin-left: 5px;
  margin-bottom: 40px;
  font-family: "Source Code Pro", sans-serif;
  font-weight: 800;
`;

export default AsideMenuBar;
