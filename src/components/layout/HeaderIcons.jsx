import { Link } from "gatsby"
import React, { useCallback, useContext, useEffect, useState } from "react"
import styled from "styled-components"

import { FaTags } from "react-icons/fa"
import { MdSearch, MdDarkMode, MdLightMode } from "react-icons/md"
import { LuCat } from "react-icons/lu"

const iconSize = "1.5rem"

const icons = [
  {
    url: "/tags",
    icon: <FaTags size={iconSize} />,
    tooltip: "tags"
  },
  {
    url: "/search",
    icon: <MdSearch size={iconSize} />,
    tooltip: "search"
  },
  {
    url: "/guestbook",
    icon: <LuCat size={iconSize} />,
    tooltip: "✨방명록"
  },
]

const IconWrapper = styled.div`
  opacity: 0.7;
  transition: opacity 0.3s ease;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`

const HeaderIcons = () => {
  const [theme, setTheme] = useState(null)

  let isDarkMode = false
  if (typeof window !== "undefined") isDarkMode = theme === window.__DARK

  const onClickDarkModeButton = useCallback(() => {
    const newTheme = isDarkMode ? window.__LIGHT : window.__DARK
    window.__setTheme(newTheme)
    setTheme(newTheme)
  }, [isDarkMode])

  useEffect(() => {
    setTheme(window.__theme)
  }, [])

  if (!theme) {
    return null
  }

  return (
    <div class="flex gap-1.5">
      <IconWrapper>
        <button onClick={onClickDarkModeButton}>
          {isDarkMode ? (
            <MdLightMode size={iconSize} />
          ) : (
            <MdDarkMode size={iconSize} />
          )}
        </button>
      </IconWrapper>
      {icons.map(item => {
        return (
          <Link to={item.url} class="relative group">
            <IconWrapper>{item.icon}</IconWrapper>
            <div class="absolute  transform -translate-x-1/2 mt-1 -ml-1 hidden group-hover:block w-max px-3 py-2 bg-gray-800 text-white text-xs rounded-md shadow-md dark:bg-gray-700">
              {item.tooltip}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default HeaderIcons
