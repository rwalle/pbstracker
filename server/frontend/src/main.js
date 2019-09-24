// main.js

import React, {Component} from 'react';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { Link} from "react-router-dom";
import { getJobNumID, getJobHost, getJobStatusTxt, archiveByID, unarchiveByID, deleteByID, getAllJobs } from "./utils"
import 'semantic-ui-css/semantic.min.css';
import { List, Checkbox, Input, Table, Header, Button, Divider } from 'semantic-ui-react';

import './app.css';

TimeAgo.addLocale(en)

const timeAgo = new TimeAgo('en-US');


function ArchivalLink ({job, context}) {
  var ele;
  if (job.archived) 
    ele = <List.Item key={"unarchive_" + job.jobid}><Button compact onClick={() => {context.handleUnarchive(job.jobid)}}>Unarchive</Button> </List.Item>;
  else
    ele = <List.Item key={"archive_" + job.jobid}><Button compact onClick={() => {context.handleArchive(job.jobid)}}>Archive</Button> </List.Item>;
  return ele;
}


class Main extends Component {

  state = {
      jobs: [],
      showArchived: false,
      jobname: '',
      username: ''
  };

  job_status_color = {
    1: 'gray',
    2: 'black',
    3: '#7CFC00',
    4: 'green',
    5: 'red'
  };

  fontcolors = []

  prepareStyles = () => {
    for (let status = 1; status <= 5; status++) {
      this.fontcolors[status] = {
        color: this.job_status_color[status],
      }
    }
  }

  componentDidMount() {
    this.prepareStyles();

    this.pullAllJobs();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.pullAllJobs, 5 * 60 * 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getRelativeTime = (date) => {
    if (date === undefined) return '';
    else return timeAgo.format(Date.parse(date));
  }

  pullAllJobs = () => {
    var state = this.state;
    getAllJobs(state)
    .then((data) => {
      state.jobs = data;
      this.setState(state);
    })

  }

  toggleArchived = () => {
    const showArchived = !(this.state.showArchived);
    this.setState({showArchived}, ()=> this.pullAllJobs());
  }

  handleUsernameInput = (e) => {
    const username = e.target.value;
    this.setState({username}, () => this.pullAllJobs());
  }

  handleJobnameInput = (e) => {
    const jobname = e.target.value;
    this.setState({jobname}, () => this.pullAllJobs());
  }

  handleArchive = (jobid) => {
    archiveByID(jobid).then(this.pullAllJobs());
  }

  handleUnarchive = (jobid) => {
    unarchiveByID(jobid).then(this.pullAllJobs());
  }

  handleDelete = (jobid) => {
    deleteByID(jobid).then(this.pullAllJobs());
  }

  back = e => {
    this.props.history.push('/');
  };


  render() {
    const { jobs } = this.state;
    return (
      <div>
        <div className="wrapper" id="wrapper">
          <Header as='h1'>PBS Tracker</Header>
          <div className="main-filter">

            <List horizontal>
              <List.Item>
                <List.Content>
                  <Checkbox toggle label='Show archived' onChange={this.toggleArchived} />
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <Input label="Jobname" onChange={(e) => this.handleJobnameInput(e)} />
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <Input label="Username" onChange={(e) => this.handleUsernameInput(e)} />
                </List.Content>
              </List.Item>
            </List>
          </div>

          <Divider hidden />

          <div>

            <Table compact striped>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Job ID</Table.HeaderCell>
                  <Table.HeaderCell>Host</Table.HeaderCell>
                  <Table.HeaderCell>Job name</Table.HeaderCell>
                  <Table.HeaderCell>Username</Table.HeaderCell>
                  <Table.HeaderCell>Submitted</Table.HeaderCell>
                  <Table.HeaderCell>Finished</Table.HeaderCell>
                  <Table.HeaderCell>Exit code</Table.HeaderCell>
                  <Table.HeaderCell>Operations</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              
              <Table.Body>

                {jobs.map(
                  (job) => (

                    <Table.Row key={job.jobid}>
                      <Table.Cell>
                        <span style={this.fontcolors[job.status]}>{getJobStatusTxt(job.status)}</span>
                      </Table.Cell>
                      <Table.Cell>{getJobNumID(job.jobid)}</Table.Cell>
                      <Table.Cell>{getJobHost(job.jobid)}</Table.Cell>
                      <Table.Cell>{job.jobname}</Table.Cell>
                      <Table.Cell>{job.username}</Table.Cell>
                      <Table.Cell>{this.getRelativeTime(job.submitted)}</Table.Cell>
                      <Table.Cell>{this.getRelativeTime(job.finished)}</Table.Cell>
                      <Table.Cell>{job.exitcode}</Table.Cell>
                      <Table.Cell>
                        <List horizontal>
                          <List.Item><Link key={"link" + job.jobid} to={{pathname: job.jobid + "/", state:{ modal: true}}}><Button compact>View</Button></Link></List.Item>
                          <List.Item><ArchivalLink job={job} context={this}/></List.Item>
                          <List.Item><Button compact onClick={() => {this.handleDelete(job.jobid)}}>Delete</Button></List.Item>
                        </List>

                      </Table.Cell>
                    </Table.Row>
                ))}
              </Table.Body>
            </Table>
    
          </div>
        </div>
      </div>
    );
  }
}


export default Main;
