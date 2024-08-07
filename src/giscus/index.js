import React, { useContext, useEffect, useRef, useState } from "react"
import { ThemeContext } from "../context/themeContext"

const Giscus = () => {
  const [mounted, setMounted] = useState(false)
  const ref = useRef(null)

  const { theme } = useContext(ThemeContext)
  const scriptElement = document.createElement("script")

  useEffect(() => {
    if (!mounted) {
      setMounted(true)
    }
  }, [mounted])

  useEffect(() => {
    scriptElement.setAttribute("src", "https://giscus.app/client.js")
    scriptElement.setAttribute("data-repo", "dahhongdu/TIL")
    scriptElement.setAttribute("data-repo-id", "R_kgDOMdZqmw")
    scriptElement.setAttribute("data-category", "General")
    scriptElement.setAttribute("data-category-id", "DIC_kwDOMdZqm84ChaC8")
    scriptElement.setAttribute("data-mapping", "pathname")
    scriptElement.setAttribute("data-strict", "0")
    scriptElement.setAttribute("data-reactions-enabled", "1")
    scriptElement.setAttribute("data-emit-metadata", "0")
    scriptElement.setAttribute("data-input-position", "top")
    scriptElement.setAttribute("data-theme", theme)
    scriptElement.setAttribute("data-lang", "en")
    scriptElement.setAttribute("crossorigin", "anonymous")
    scriptElement.async = true

    if (ref.current) {
      ref.current.appendChild(scriptElement)
    }
  }, [mounted, theme])

  if (!mounted) return null

  return <div ref={ref} />
}

export default Giscus
