import { Link } from "gatsby"
import React, { useCallback, useContext, useEffect, useState } from "react"
import styled from "styled-components"

import { FaTags } from "react-icons/fa"
import { MdSearch, MdDarkMode, MdLightMode } from "react-icons/md"

const iconSize = "1.5rem"

const icons = [
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
  opacity: 0.7;
  transition: opacity 0.3s ease;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`

const HeaderIcons = () => {
  // const { theme, setTheme } = useContext(ThemeContext)

  // const toggleDarkMode = () => {
  //   if (document.documentElement.classList.contains("dark")) {
  //     document.documentElement.classList.remove("dark")
  //     localStorage.setItem(LOCALSTORAGE_THEME_KEY, "light")
  //     setTheme("light")
  //   } else {
  //     document.documentElement.classList.add("dark")
  //     localStorage.setItem(LOCALSTORAGE_THEME_KEY, "dark")
  //     setTheme("dark")
  //   }
  // }

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
          <Link to={item.url}>
            <IconWrapper>{item.icon}</IconWrapper>
          </Link>
        )
      })}
    </div>
  )
}

export default HeaderIcons
