// detail_page.js

import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link} from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import { Header, Divider } from 'semantic-ui-react';


import Detail from './detail'

function DetailPage({ match, location, history }) {
  
    let jobid = match.params.jobid;

  return (

    <div>
        <div className="wrapper" id="wrapper">
            <Link to="/">Return to main</Link>
            <Divider  />
            <Header as='h1'>Job details</Header>
            <Detail jobid={jobid} />
        </div>
    </div>

  );
};


export default DetailPage;