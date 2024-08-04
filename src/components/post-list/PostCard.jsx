import { Link } from "gatsby"
import React from "react"

const PostCard = ({ post }) => {
  const url = post.fields.slug
  const { title, description, date, tags } = post.frontmatter

  return (
    <Link
      to={url}
      className="block bg-white border border-gray-300 rounded-lg  p-4 my-5 hover:bg-gray-100 transition duration-300"
    >
      <div className="text-2xl font-bold text-gray-800">{title}</div>
      <div className="text-gray-600 mb-2">{date}</div>
      <div className="text-gray-700">{description}</div>
      <div className="flex flex-wrap gap-2 mt-2">
        <span className="text-gray-500">🏷️</span>
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}

export default PostCard
