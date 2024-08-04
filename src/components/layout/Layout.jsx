import * as React from "react"
import Header from "./Header"
import Footer from "./Footer"

const Layout = ({ location, title, children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title={title} />
      <main className="flex flex-1 justify-center items-start pt-20 p-4">
        <div className="flex flex-col items-center max-w-4xl w-full space-y-4">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout
