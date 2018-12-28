import React from 'react'
import ReactDOM from 'react-dom'
import { Head, Root, Routes } from 'react-static'
import { Link } from '@reach/router'
import { ApolloProvider } from 'react-apollo'
//

import client from './graphcms/connectors/apollo'

import './app.css'

const query = `
  {
    blogPosts {
      id
      createdAt
      title
      post
    }
  }
`

const App = () => (
  <ApolloProvider client={client}>
    <Root>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">DT</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse text-right" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item mx-3">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item mx-3">
              <a className="nav-link" href="/blog">Blog</a>
            </li>
            <li className="nav-item mx-3">
              <a className="nav-link" href="/contactme">Contact</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="content" >
        <Routes />
      </div>
    </Root>
  </ApolloProvider>
)

export default App
