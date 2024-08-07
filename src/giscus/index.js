import React, { useEffect, useRef, useState } from "react"

const Giscus = () => {
  const ref = useRef(null)

  const [commentTheme, setCommentTheme] = useState(null)

  useEffect(() => {
    setCommentTheme(window.__theme === window.__DARK ? "dark" : "light")
    window.__onThemeChange = theme => {
      setCommentTheme(theme === window.__DARK ? "dark" : "light")
    }
  }, [])

  useEffect(() => {
    const scriptElement = document.createElement("script")
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
    scriptElement.setAttribute("data-theme", commentTheme)
    scriptElement.setAttribute("data-lang", "en")
    scriptElement.setAttribute("crossorigin", "anonymous")
    scriptElement.async = true

    if (ref.current) {
      ref.current.appendChild(scriptElement)
    }
  })


  if (!commentTheme) return null

  return <div ref={ref} />
}

export default Giscus
