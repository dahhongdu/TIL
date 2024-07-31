import React, { useEffect, useState } from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import kebabCase from "lodash.kebabcase";
import { siteMetadata } from "../../../gatsby-config";
import PostPagination from "../pagination";

const PostList = ({ posts }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [posts]);

  // isPrivate가 true인 항목 필터링
  const filteredPosts = posts.filter(post => !post.frontmatter.isPrivate);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <PostListContainer>
      {filteredPosts.length === 0 ? (
        <EmptySpace />
      ) : (
        <>
          {currentPosts.map((post, index) => {
            const { title, description, date, tags, series, previewImage } = post.frontmatter;
            const slug = post.fields.slug;
            const body = post.excerpt || (post.rawMarkdownBody && truncate(post.rawMarkdownBody, 80));

            return (
              <PostLink to={slug} key={index}>
                <PostCard>
                  <PostContent>
                    <PostTitle>{title || slug}</PostTitle>
                    {tags && (
                      <PostTags>
                        {tags.map((tag) => (
                          <PostTag key={kebabCase(tag)}>
                            #{tag} {" "}
                          </PostTag>
                        ))}
                      </PostTags>
                    )}

                    
                    <PostDescription>
                      {description || truncate(body, 80)}
                    </PostDescription>  
                    <Date>{date}</Date>
                  </PostContent>
                </PostCard>
              </PostLink>
            );
          })}
          <PostPagination
            totalPosts={filteredPosts.length}
            postsPerPage={postsPerPage}
            paginate={paginate}
            currentPage={currentPage}
          />
        </>
      )}
    </PostListContainer>
  );
};

const truncate = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

const PostListContainer = styled.div`
  h1 {
    margin-bottom: 20px;
    font-size: 2rem;
    color: ${props => props.theme.main.text}; 
  }
`;

const PostLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  transition: color 0.3s ease, background 0.3s ease; 
`;

const PostCard = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.postlist.border};
  cursor: pointer;
  padding: 20px;
  width: 100%;
  transition: opacity 1s ease, background 1s ease;

  &:hover {
    opacity: 0.8;
    background: ${props => props.theme.postlist.hoverBackground}; 
  }
`;

const PostContent = styled.div`
  flex: 1;
`;

const Date = styled.div`
  margin-top: 1rem;
  font-size: 14px;
  color: ${props => props.theme.postlist.date};
  opacity: 0.8;
  transition: color 1s ease; 
`;

const PostTitle = styled.h1`
  color: ${props => props.theme.main.text};
  font-size: 0.5rem;
  margin-top: 30px;
  margin-bottom: 15px;
  word-break: break-all;
  font-weight: 600;
  line-height: 110%;
  transition: color 1s ease; 
`;

const PostTags = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const PostTag = styled.span`
  color: ${props => props.theme.postlist.tag};
  opacity: 0.8;
  font-size: 15px;
  margin-right: 13px;
  transition: color 1s ease; 
`;

const PostDescription = styled.p`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 15.5px;
  line-height: 170%;
  color: ${props => props.theme.postlist.text};
  transition: color 1s ease; 
  word-break: break-all;
`;

const EmptySpace = styled.div`
  height: 80vh;
`;


export default PostList;
