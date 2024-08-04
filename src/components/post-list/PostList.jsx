import React from 'react'
import PostCard from "./PostCard"

const PostList = ({ posts }) => {
  return (
    <ol class="w-full" style={{ listStyle: `none` }}>
      {posts.map(post => {
        return <PostCard post={post} />
      })}
    </ol>
  )
}

export default PostList
