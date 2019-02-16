import React from 'react'
import ReactDOM from 'react-dom'
import { withRouteData } from 'react-static'

import '../../public/images/doge.png'
//

export default withRouteData(({headline, intro, button, name, snippet}) => (
  <div>
    <div className="jumbotron" style={{textAlign: 'center'}}>
      <div className="row">
        <div className="col-lg-4"></div>
        <div className="col-lg-4">
          <img src={require('../../public/images/P2090245_headshot.jpg')} alt="my face here" className="rounded-circle profile-img" style={{width:'20em', height:'20em'}}/>
        </div>
        <div className="col-lg-4"></div>
      </div>
      <h1 className="display-4">{name}</h1>
      <p className="lead">{snippet}</p>
    </div>
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h1 className="display-5">{headline}</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <p className="lead">{intro}</p>
        </div>
      </div>
    </div>
  </div>
))
