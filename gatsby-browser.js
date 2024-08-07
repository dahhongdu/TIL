// Custom typefaces
import "@fontsource-variable/montserrat"
import "@fontsource/merriweather"

// Import Prism.js theme
import "prismjs/themes/prism-okaidia.css"

// Tailwind import
import "./src/styles/global.css"

import React from "react"
import { ThemeProvider } from "./src/context/themeContext"

export const wrapRootElement = ({ element }) => {
  return <ThemeProvider>{element}</ThemeProvider>
}
