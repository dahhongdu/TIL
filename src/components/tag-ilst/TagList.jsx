import { Link } from 'gatsby'
import React from "react"

var kebabCase = require("lodash.kebabcase")

const TagList = ({ group }) => {
  return (
    <div>
      <h1 class="text-5xl font-bold italic my-10">Tags</h1>
      <p class="font-semibold my-10">🏷️ 모든 태그를 모아둔 페이지입니다.</p>
      <ul className="flex flex-wrap gap-2">
        {group.map(tag => (
          <li key={tag.fieldValue}>
            <Link
              className="inline-block font-semibold py-2 px-4 bg-tag rounded-lg shadow-sm hover:bg-tag-hover transition duration-300"
              to={`/tags/${kebabCase(tag.fieldValue)}/`}
            >
              <span className="text-md">{tag.fieldValue}</span> (
              {tag.totalCount})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TagList
