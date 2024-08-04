import { Link } from "gatsby"
import React from "react"
import styled from "styled-components"

import { FaTags } from "react-icons/fa"
import {
  MdDarkMode,
  MdLightMode,
  MdOutlineMenu,
  MdSearch,
} from "react-icons/md"

const iconSize = "1.5rem"

const icons = [
  {
    icon: <MdDarkMode size={iconSize} />,
  },
  {
    url: "/tags",
    icon: <FaTags size={iconSize} />,
  },
  {
    url: "/search",
    icon: <MdSearch size={iconSize} />,
  },
]

const IconWrapper = styled.div`
  opacity: 0.6;
  transition: opacity 0.3s ease;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`

const HeaderIcons = () => {
  return (
    <div class="flex gap-1.5">
      {icons.map((item) => {
        return (
          <Link to={item.url}>
            <IconWrapper>{item.icon}</IconWrapper>
          </Link>
        )
      })}
    </div>
  )
}

export default HeaderIcons
