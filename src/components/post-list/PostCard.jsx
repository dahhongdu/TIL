import { Link } from "gatsby"
import React from "react"

const PostCard = ({ post }) => {
  const url = post.fields.slug
  const { title, description, date, tags } = post.frontmatter

  return (
    <Link
      to={url}
      className="block bg-gray-100 rounded-lg  p-5 my-5 hover:bg-gray-200 transition duration-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
    >
      <div className="text-2xl font-bold text-gray-800 dark:text-neutral-200">{title}</div>
      <div className="text-gray-600 mb-2 dark:text-neutral-300">{date}</div>
      <div className="text-gray-700  dark:text-neutral-300">{description}</div>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-300 text-gray-700 rounded-full px-3 py-1 text-sm dark:bg-neutral-700 dark:text-neutral-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}

export default PostCard
