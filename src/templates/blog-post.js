import * as React from "react"
import { Link, graphql } from "gatsby"
import kebabCase from "lodash.kebabcase"

import Bio from "../components/bio/bio"
import Layout from "../components/layout/Layout"
import Seo from "../components/seo"
import Giscus from "../giscus/index"

const BlogPostTemplate = ({
  data: { previous, next, site, markdownRemark: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`
  const tags = post.frontmatter?.tags || []

  return (
    <Layout location={location} title={siteTitle}>
      <div className="px-4 md:px-8 lg:px-16">
        <header className="mt-3 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">
            {post.frontmatter.title}
          </h1>
          <div className="my-3 text-sm text-gray-600 dark:text-neutral-300">
            {post.frontmatter.date}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, index) => (
              <Link
                key={index}
                className="inline-flex items-center rounded-full bg-slate-300 px-3 py-1 text-black text-sm font-semibold border-0 hover:bg-slate-400 dark:bg-neutral-700 dark:text-neutral-300"
                to={`/tags/${kebabCase(tag)}`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.tableOfContents }}
          className="prose dark:prose-invert dark:text-neutral-300 group text-m top-4 mb-10 hide-on-mobile"
        ></section>
        <hr />
        <br />
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          className="prose dark:prose-invert dark:text-neutral-300"
        />
        <footer className="mt-10">
          <Bio />
        </footer>
      </div>

      <nav className="w-full py-6">
        <ul className="flex justify-between list-none p-0 m-0 space-x-4">
          <li className="w-full">
            {previous ? (
              <Link
                to={previous.fields.slug}
                rel="prev"
                className="block w-full text-center py-3 px-6 bg-gray-300 text-black rounded-lg shadow-md hover:bg-neutral-700 hover:text-white transition duration-300 dark:bg-neutral-800 dark:text-neutral-300"
              >
                ← {previous.frontmatter.title}
              </Link>
            ) : (
              <div
                className="block w-full text-center py-3 px-6 bg-gray-200 text-gray-500 rounded-lg shadow-md 
              dark:bg-neutral-800 dark:text-neutral-500"
              >
                No previous post
              </div>
            )}
          </li>
          <li className="w-full">
            {next ? (
              <Link
                to={next.fields.slug}
                rel="next"
                className="block w-full text-center py-3 px-6 bg-gray-300 text-black rounded-lg shadow-md hover:bg-neutral-700 hover:text-white transition duration-300 dark:bg-neutral-800 dark:text-neutral-300"
              >
                {next.frontmatter.title} →
              </Link>
            ) : (
              <div className="block w-full text-center py-3 px-6 bg-gray-200 text-gray-500 rounded-lg shadow-md dark:bg-neutral-800 dark:text-neutral-500">
                No next post
              </div>
            )}
          </li>
        </ul>
      </nav>
      <Giscus />
    </Layout>
  )
}

export const Head = ({ data: { markdownRemark: post } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
    />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      tableOfContents
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        tags
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
