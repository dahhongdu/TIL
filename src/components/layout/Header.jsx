import React from "react"
import HeaderIcons from './HeaderIcons'
import { Link } from 'gatsby'

const Header = ({ title }) => {
  return (
    <div className="fixed top-0 left-0 w-full bg-white bg-opacity-90 shadow-sm z-50 flex justify-between items-center p-4">
      <div className="text-lg font-bold">
        <Link to="/" className="text-black hover:text-gray-800 transition duration-300">
          {title}
        </Link>
      </div>
      <div>
        <HeaderIcons />
      </div>
    </div>
  )
}

export default Header
