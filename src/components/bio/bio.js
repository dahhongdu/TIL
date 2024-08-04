/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import { IoLogoGithub, IoMailSharp } from "react-icons/io5"
import IconBtn from "./icon-btn"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            github
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  return (
    <div class="flex items-center justify-start w-full h-32 gap-2">
      <div class="flex-shrink-0">
        <img
          class="w-24 h-24 rounded-full object-cover"
          src="https://github.com/dahhongdu.png"
          alt="profile picture"
        />
      </div>

      <div class="ml-4 flex flex-col justify-center">
        {author?.name && (
          <div class="text-left">
            <div class="text-xl font-extrabold italic">@{author.name}</div>
            <div class="text-lg">{author?.summary || null}</div>
            <div class="flex flex-row gap-1.5 mt-2">
              <IconBtn
                url={`https://github.com/${social?.github}`}
                icon={<IoLogoGithub size="1.5rem" />}
              />
              <IconBtn
                url={`mailto:${social?.email}@gmail.com`}
                icon={<IoMailSharp size="1.5rem" />}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Bio
