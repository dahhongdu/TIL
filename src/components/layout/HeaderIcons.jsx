import { Link } from "gatsby"
import React, { useEffect, useState } from "react"
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
  opacity: 0.6;
  transition: opacity 0.3s ease;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`

const HeaderIcons = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode === "true") {
      setDarkMode(true)
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem("darkMode", newMode.toString())
  }

  return (
    <div class="flex gap-1.5">
      <IconWrapper>
        <button onClick={toggleDarkMode}>
          {darkMode ? <MdLightMode size={iconSize}/> : <MdDarkMode size={iconSize}/>}
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
