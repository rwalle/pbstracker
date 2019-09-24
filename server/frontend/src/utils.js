// utils.js


import axios from 'axios';
import { config } from "./config"
import Cookies from 'js-cookie';


const jobStatusTxt = {
    1: 'submitted',
    2: 'started',
    3: 'exited',
    4: 'finished',
    5: 'error'
    };

const axiosOptions = () => 
    ({auth: {username: config.basic_auth.user, password: config.basic_auth.pass}});
    // ({headers: {'X-CSRFToken': Cookies.get('csrftoken')}})


export const getJobNumID = (jobID) => RegExp("(\\d+)\..+").test(jobID) ?
    RegExp("(\\d+)\..+").exec(jobID)[1] : '';

export const getJobHost = (jobID) => RegExp("\\d+\.(\\w+)\\-adm.+").test(jobID) ? 
    RegExp("\\d+\.(\\w+)\\-adm.+").exec(jobID)[1] : '';
    
export const getJobStatusTxt = (status) => jobStatusTxt[status];

export const archiveByID = (jobid) => {

    return axios.post(`${config.api}${jobid}/archive/`, {}, axiosOptions())
    .then((res) => {})
    .catch((err) => {
        alert(err);
    });
};

export const unarchiveByID = (jobid) => {

    return axios.post(`${config.api}${jobid}/unarchive/`, {}, axiosOptions())
    .then((res) => {})
    .catch((err) => {
        alert(err);
    });
};

export const deleteByID = (jobid) => {

    return axios.delete(`${config.api}${jobid}/`, axiosOptions())
    .then((res) => {})
    .catch((err) => {
        alert(err);
    });
};

export const getAllJobs = (state) => {
    var b = new URLSearchParams();
    var {showArchived, username, jobname} = state;
    if (showArchived) b.append('show_archived', 'true');
    if (username) b.append('username', username);
    if (jobname) b.append('jobname', jobname);

    return axios.get(config.api + '?' + b, axiosOptions())
    .then((response) => response.data)
    .catch((err) => {
      alert('Failed to fetch jobs.');
    });
  };

export const getJobByJobId = (jobid) => {
    return axios.get(`${config.api}${jobid}/`, axiosOptions())
    .then((response) => response.data)
    .catch((err) => {
        alert('Failed to fetch the job.');
    });
  };

