import React from "react"

import { Link, graphql } from "gatsby"
import Layout from '../components/layout/Layout'
import Seo from '../components/seo'
import PostCard from '../components/post-list/PostCard'

const Tags = ({ pageContext, data, location }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title={tag} />
      <div>
        <p class="text-3xl font-bold italic my-10">{totalCount} posts in {tag.toUpperCase()}</p>
      </div>
      <p class="font-semibold my-10">🏷️ {tag}의 포스트를 모아둔 페이지입니다.</p>
      <ul>
        {
        edges.map(({ node }) => {
          return (
            <PostCard post={node}/>
          )
        }
      )
        }
      </ul>
    </Layout>
  )
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: ASC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            description
            tags
          }
        }
      }
    }
  }
`