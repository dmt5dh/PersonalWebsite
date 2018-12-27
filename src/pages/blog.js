import React from 'react'
import ReactDOM from 'react-dom'
import { withRouteData } from 'react-static'
import { Link } from '@reach/router'
//

import BlogData from '../graphcms/queries/BlogPosts'

export default withRouteData(({ blogPosts, title }) => (
  <div className="container">
    <div className="row">
      <div className="col-md-12">
        <h1 className="display-4">{title}</h1>
      </div>
    </div>
    <BlogData />
  </div>
))
