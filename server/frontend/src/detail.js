// detail.js

import React, {Component} from 'react';
import { getJobByJobId, getJobStatusTxt, archiveByID, unarchiveByID, deleteByID, getArchiveElement } from "./utils"

import { List, Header, Form, TextArea, Modal, Button } from 'semantic-ui-react';
import { withRouter } from "react-router";
import './app.css';

function ArchivalLink ({job, context}) {
  var ele;
  if (job.archived) 
    ele = <List.Item key={"unarchive_" + job.jobid}><Button compact onClick={() => { context.handleUnarchive(job.jobid)}}>Unarchive</Button> </List.Item>;
  else
    ele = <List.Item key={"archive_" + job.jobid}><Button compact onClick={() => {context.handleArchive(job.jobid)}}>Archive</Button> </List.Item>;
  return ele;
}

function StdoutTextArea ({job}) {
  return (job.stdout ? <List.Item key="stdout">stdout:<Form><TextArea readonly>{job.stdout}</TextArea></Form></List.Item> : '');
}

function StderrTextArea ({job}) {
  return (job.stderr ? <List.Item key="stderr">stderr:<Form><TextArea readonly>{job.stderr}</TextArea></Form></List.Item> : '');
}


class Detail extends Component {

  state = {
      job: {},
      isModal: true
  };

  componentDidMount() {
    var { jobid } = this.props;
    if (jobid === undefined) {
      // comes from url
      var { jobid } = this.props.match.params;
      this.setState({isModal: false});
    }
    
    this.pullJob(jobid);
  }

  


  pullJob = (jobid) => {
    getJobByJobId(jobid).then((job) => this.setState({job: job}));
  }

  handleArchive = (jobid) => {
    archiveByID(jobid).then(this.pullJob(jobid));
  }

  handleUnarchive = (jobid) => {
    unarchiveByID(jobid).then(this.pullJob(jobid));
  }

  back = () => {
    this.props.history.push('/');
  };

  handleDelete = (jobid) => {
    deleteByID(jobid).then(this.back());
  }

  formatDateTime = (dtstr) => {
    if (dtstr) {
      let dt = new Date(dtstr);
      return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    }
    else return '';
  }
  

  render() {
    const { job } = this.state;
    return job? (
      <div>
        <List>
          <List.Item key="jobid">
            Job ID: {job.jobid}
          </List.Item>
          <List.Item key="jobname">
            Job name: {job.jobname}
          </List.Item>
          <List.Item key="username">
            Username: {job.username}
          </List.Item>
          <List.Item key="status">
            Status: {getJobStatusTxt(job.status)}
          </List.Item>
          <List.Item key="submitted">
            Submitted on: {this.formatDateTime(job.submitted)}
          </List.Item>
          <List.Item key="started">
            Started on: {this.formatDateTime(job.started)}
          </List.Item>
          <List.Item key="finished">
            Finished on: {this.formatDateTime(job.finished)}
          </List.Item>
          <List.Item key="exitcode">
            Exit code: {job.exitcode}
          </List.Item>
          <StdoutTextArea job={job} />
          <StderrTextArea job={job} />
          <List.Item key="operations">
            <List horizontal>
              <List.Item>Operations:</List.Item>
              <List.Item><ArchivalLink job={job} context={this}/></List.Item>
              <List.Item><Button compact onClick={() => {this.handleDelete(job.jobid)}}>Delete</Button></List.Item>
            </List>
          </List.Item>
        </List>
      </div>) : (<div>cannot display this job</div>)
    ;
  }
}

export default withRouter(Detail);
