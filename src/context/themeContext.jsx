import React, { createContext, useState } from "react"
import { LOCALSTORAGE_THEME_KEY } from "../components/constants/constants"

const ThemeContext = createContext()

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem(LOCALSTORAGE_THEME_KEY) || "light"
  )

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeProvider }
