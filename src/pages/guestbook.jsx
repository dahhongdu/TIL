import Layout from "../components/layout/Layout"
import Giscus from "../giscus/index"
import React from "react"
import { graphql } from "gatsby"

const GuestBook = ({
  data: {
    site: {
      siteMetadata: { title },
    },
  },
}) => {
  return (
    <Layout title={title}>
      <div class="text-xl mb-10">방명록 작성하기 ✍🏻✨</div>
      <Giscus />
    </Layout>
  )
}

export default GuestBook

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
