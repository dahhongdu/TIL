// Custom typefaces
import "@fontsource-variable/montserrat"
import "@fontsource/merriweather"

// Import Prism.js theme
import "prismjs/themes/prism-okaidia.css"

// Tailwind import
import "./src/styles/global.css"

import React from "react"
import { ThemeProvider } from "./src/context/themeContext"

const setTheme = () => {
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark")
  }
}

export const onClientEntry = () => {
  setTheme()
}

export const wrapRootElement = ({ element }) => {
  return <ThemeProvider>{element}</ThemeProvider>
}
