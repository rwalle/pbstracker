import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';
import ModalSwitch from './modal_switch';
  
  
function Rt() {
    
    return (
        <Router>
            <Route component={ModalSwitch} />
        </Router>
    );
}

ReactDOM.render(<Rt />, document.getElementById('root'));
