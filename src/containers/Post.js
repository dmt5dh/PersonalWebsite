import React from 'react'
import { withRouteData } from 'react-static'
import { Link } from '@reach/router'
//

import SinglePostData from '../graphcms/queries/GetPost'

export default withRouteData(({ post }) => (
  <div className="container">
    <SinglePostData id={post.id}/>
  </div>
))
