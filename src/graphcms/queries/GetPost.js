import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const Post = ({ data: {loading, error, post} }) => {
  if(error) {
    return <h1>Error loading post!</h1>
  }
  if(!loading) {
    return (
      <div>
        <div className="row">
          <div className="col-md-7">
            <h1 className="float-left">{post.title}</h1>
          </div>
          <div className="col-md-5">
            <h4 className="float-right"><small><em>{new Date(post.dateAndTime).toDateString()}</em></small></h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12" dangerouslySetInnerHTML={{__html: post.content}}>
          </div>
        </div>
      </div>
    )
  }
  return <h1>Loading Post...</h1>
}

const singlePost = gql`
  query post($id: ID!) {
    post(where: {id: $id}) {
      id
      title
      content
      dateAndTime
    }
  }
`

const SinglePostData = graphql(singlePost, {
  options:({id})=>({
    variables: {
      id: id
    }
  })
})(Post)

export default SinglePostData
