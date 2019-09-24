import requests, json, sys

from .config_file import get_config

# import logging
# logger = logging.getLogger(__name__)

CONFIG = get_config()
API_URL = CONFIG['api_root']
TIMEOUT = 10


class BearerAuth(requests.auth.AuthBase):

    token = None

    def __init__(self, token):
        self.token = token

    def __call__(self, r):
        r.headers["authorization"] = "Bearer " + self.token

        return r


def get_auth():

    auth_config = CONFIG['auth']
    if 'basic' in auth_config:
        return (
            auth_config['basic']['user'],
            auth_config['basic']['pass']
        )
    elif 'bearer' in auth_config:
        return BearerAuth(auth_config['bearer']['token'])


def submitted(jobid, jobname, username):

    url = f'{API_URL}/'

    req = requests.post(url, json=
        {
            'jobid': jobid,
            'jobname': jobname,
            'username': username
        }, auth=get_auth(), timeout=TIMEOUT)

    # logger.info("turn monitor %s" + txt)

    return (req.status_code, req.reason, req.text)


def started(jobid):

    url = f'{API_URL}/{jobid}/started/'

    req = requests.post(url, auth=get_auth(), timeout=TIMEOUT)

    return (req.status_code, req.reason, req.text)


def exited(jobid, exitcode):

    url = f'{API_URL}/{jobid}/exited/'

    req = requests.post(url, json={'exitcode': exitcode}, auth=get_auth(), timeout=TIMEOUT)

    return (req.status_code, req.reason, req.text)


def finished(jobid, path_to_outfile, path_to_errfile):

    url = f'{API_URL}/{jobid}/finished/'

    with open(path_to_outfile, 'r') as outfile:
        stdout = outfile.read()
    with open(path_to_errfile, 'r') as errfile:
        stderr = errfile.read()

    req = requests.post(url, json={
        'jobid': jobid,
        'stdout': stdout,
        'stderr': stderr
        }, auth=get_auth(), timeout=TIMEOUT)

    return (req.status_code, req.reason, req.text)

