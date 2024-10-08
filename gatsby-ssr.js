/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
const React = require("react")

exports.onRenderBody = ({ setPreBodyComponents, setHtmlAttributes }) => {
  // const script = `
  // if (
  //   localStorage.theme === "dark" ||
  //   (!("theme" in localStorage) &&
  //     window.matchMedia("(prefers-color-scheme: dark)").matches)
  // ) {
  //   document.documentElement.classList.add("dark")
  // }

  // const setTheme = () => {
  //   if ()
  // }
  // `

  const script = `
  window.__DARK = 'dark';
  window.__LIGHT = 'light';
  
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme');

  window.__theme = savedTheme || (darkQuery.matches ? window.__DARK : window.__LIGHT);
  window.__onThemeChange = () => {};

  window.__setTheme = (newTheme) => {
    if (newTheme === window.__DARK) {
      document.body.classList.add(window.__DARK);
    } else {
      document.body.classList.remove(window.__DARK);
    }
    localStorage.setItem('theme', newTheme);
    window.__theme = newTheme;
    window.__onThemeChange(newTheme);
  };
  darkQuery.addListener((e) => {
    window.__setTheme(e.matches ? window.__DARK : window.__LIGHT);
  });

  window.__setTheme(window.__theme);
  `

  setHtmlAttributes({ lang: `en` })
  setPreBodyComponents(<script dangerouslySetInnerHTML={{ __html: script }} />)
}