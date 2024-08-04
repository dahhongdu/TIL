import { Link } from 'gatsby'
import React from "react"

const Footer = () => {
  return (
    <footer class="m-5">
      © {new Date().getFullYear()} {` `}
      <Link to="www.github.com/dahhongdu">
        <strong>다홍</strong>
      </Link>
    </footer>
  )
}

export default Footer
