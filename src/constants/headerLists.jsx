import React from "react";

import { MdOutlineDarkMode } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { FaBook } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaCommentAlt, FaTags  } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";

export const menuItems = [
  { to: '/search', icon: <IoSearch className="icon" size="23" />, text: '', showText: false },
  { to: '/tags', icon: <FaTags className="icon" size="23" />, text: 'Tags', showText: true },
  { to: '/series', icon: <FaBook className="icon" size="23" />, text: 'Series', showText: true },
  { to: '/about', icon: <BsFillPeopleFill className="icon" size="23" />, text: 'About', showText: true },
  { to: '/community', icon: <GiPartyPopper className="icon" size="23" />, text: '방명록', showText: true },
];
