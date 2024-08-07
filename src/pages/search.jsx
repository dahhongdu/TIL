import React, { useState } from "react"
import { graphql, StaticQuery } from "gatsby"
import { LuDog } from "react-icons/lu"

import Layout from "../components/layout/Layout"
import SEO from "../components/seo"
import PostCard from "../components/post-list/PostCard"

const Search = ({ data }) => {
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = e => {
    const query = e.target.value.toLowerCase()
    setSearch(query)

    if (query === "") {
      setSearchResults([])
      return
    }

    const filteredData = data.allMarkdownRemark.nodes.filter(
      node =>
        node.frontmatter.title.toLowerCase().includes(query) ||
        node.frontmatter.description.toLowerCase().includes(query)
    )
    setSearchResults(filteredData)
  }

  const siteTitle = data.site.siteMetadata.title || `Title`

  return (
    <Layout title={siteTitle}>
      <SEO
        title="search"
        keywords={["blog", "gatsby", "frontend", "backend"]}
      />
      <div className="flex items-center bg-gray-200 p-2 gap-2 rounded-md dark:bg-neutral-700">
        <LuDog size="2rem" />
        <input
          className="focus:outline-none bg-transparent placeholder-gray-500 text-xl w-full dark:placeholder-neutral-300"
          placeholder="search..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Render search results */}
      <div className="mt-4">
        <h2 className="text-2xl font-bold mb-2">Search Results:</h2>
        {searchResults.length === 0 && <p>No results found.</p>}
        {searchResults.map(node => (
          <PostCard post={node} />
        ))}
      </div>
    </Layout>
  )
}

export default () => (
  <StaticQuery
    query={graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
          nodes {
            excerpt
            fields {
              slug
            }
            frontmatter {
              date(formatString: "MMMM DD, YYYY")
              title
              description
              tags
            }
          }
        }
      }
    `}
    render={data => <Search data={data} />}
  />
)
