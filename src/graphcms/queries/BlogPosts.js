import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const POSTS_PER_PAGE = 6;

const Blog = ({data: {loading, error, posts, postsConnection}, loadMorePosts }) => {
  if(loading) {
    return <p>Loading...</p>
  }
  if(error) {
    return <p>Error!</p>
  }
  if(posts && postsConnection){
    const areMorePosts = posts.length < postsConnection.aggregate.count;
    console.log(posts);
    return(
      <div>
        <div className="row">
          {posts.map(post => (
            <div className="col-md-6 mb-2">
              <div className="card" style={{width: "parent"}}>
                <div className="card-body">
                  <h5 className="card-title" style={{height: "1em"}}>{post.title}</h5>
                  <p className="card-text text-muted lead" style={{height: "3em",overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{post.previewText}</p>
                <a href={`/blog/post/${post.id}/`} className="btn btn-primary float-right">Read More</a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="row mt-5">
          {areMorePosts
            ? <button type="button"  disabled={loading} className="btn btn-secondary btn-lg btn-block" onClick={() => loadMorePosts()}>
            {loading ? 'Loading...' : 'Show More Posts'}
            </button>
          : ''}
        </div>
      </div>
    )
  }
}

// Connexion with apollo
const blogQuery = gql `
  query posts($first: Int!, $skip: Int!) {
    posts(orderBy: createdAt_DESC, first: $first, skip: $skip) {
      id
      title
      content
      createdAt
      previewText
    },
    postsConnection {
      aggregate {
        count
      }
    }
  }
`

const postQueryVars = {
  skip: 0,
  first: POSTS_PER_PAGE
}

const BlogData = graphql(blogQuery, {
  options: {
    variables: postQueryVars
  },
  props: ({data}) => ({
    data,
    loadMorePosts: () => {
      return data.fetchMore({
        variables: {
          skip: data.posts.length
        },
        updateQuery: (previousResult, {fetchMoreResult}) => {
          if(!fetchMoreResult) {
            return previousResult;
          }
          return Object.assign({}, previousResult, {
            posts: [...previousResult.posts, ...fetchMoreResult.posts]
          })
        }
      })
    }
  })
})(Blog)

export default BlogData
