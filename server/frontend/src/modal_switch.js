// modal_switch.js
import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import Main from './main'
import DetailModal from './detail_modal'
import DetailPage from './detail_page'
import Notfound from './notfound'

class ModalSwitch extends Component {

    previousLocation = this.props.location;
  
    componentWillUpdate(nextProps) {
      let { location } = this.props;
  
      if (
        nextProps.history.action !== "POP" &&
        (!location.state || !location.state.modal)
      ) {
        this.previousLocation = this.props.location;
      }
    }
  
    render() {
  
      let { location } = this.props;
  
      let isModal = !!(
        location.state &&
        location.state.modal &&
        this.previousLocation !== location
      );
  
      return (
        <div>
          <Switch location={isModal ? this.previousLocation : location}>
              <Route exact path="/" component={Main} />
              <Route path="/:jobid/" component={DetailPage} />
              <Route component={Notfound} />
          </Switch>
          {isModal ? <Route path="/:jobid/" component={DetailModal} /> : null}
       </div>
  
      )
    }
  }

export default ModalSwitch;