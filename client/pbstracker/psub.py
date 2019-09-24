#!/usr/bin/env python3

import os
import subprocess
import sys
import getpass

try:
    import requests
except ImportError:
    print("""module `requests` does not exist. Install by running
        pip3 install requests --user
        or
        pip install requests --user
        """)
    raise

from .pbs_helper import sub_to_dict, get_jobinfo_from_jobid
from .config_file import get_config
from .tracker_helper import submitted

PBSTRACKER_CLIENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROLOGUE_SCRIPT_FILENAME = 'report_started.py'
EPILOGUE_SCRIPT_FILENAME = 'report_exited.py'
CHECK_SCRIPT_FILENAME = 'report_finished_bash.sh'

PATH_TO_PROLOGUE_SCRIPT = os.path.join(PBSTRACKER_CLIENT_DIR, PROLOGUE_SCRIPT_FILENAME)
PATH_TO_EPILOGUE_SCRIPT = os.path.join(PBSTRACKER_CLIENT_DIR, EPILOGUE_SCRIPT_FILENAME)
PATH_TO_CHECK_SCRIPT = os.path.join(PBSTRACKER_CLIENT_DIR, CHECK_SCRIPT_FILENAME)


def submit_and_track(path_to_subfile):

    config = get_config()

    jobid = subprocess.check_output(['qsub', '-l', f'prologue={PATH_TO_PROLOGUE_SCRIPT},epilogue={PATH_TO_EPILOGUE_SCRIPT}',
                                     path_to_subfile]).decode('utf8')
    jobid = jobid.strip()
    print(jobid)

    job_dict = sub_to_dict(path_to_subfile)

    jobinfo = get_jobinfo_from_jobid(jobid)

    jobname = job_dict.get('N')
    if jobname is None:
        jobname = jobinfo.get('jobname')

    path_to_job_outfile = job_dict.get('o')
    if path_to_job_outfile is None:
        path_to_job_outfile = jobinfo.get('outpath')

    path_to_job_errfile = job_dict.get('e')
    if path_to_job_errfile is None:
        path_to_job_errfile = jobinfo.get('errpath')

    username = getpass.getuser()

    path_to_check_outfile = os.path.join(config['tracker_log_dir'], jobid + '.stdout.log')
    path_to_check_errfile = os.path.join(config['tracker_log_dir'], jobid + '.stderr.log')
    check_queue = config['tracker_queue']
    check_node = config['tracker_node']

    with open(os.devnull, 'w') as f:
        subprocess.call(['qsub', '-o', path_to_check_outfile, '-e', path_to_check_errfile,
                     '-l', f'nodes=1:ppn={check_node},walltime=0:01:00', '-q', check_queue,
                     '-F', f'{PBSTRACKER_CLIENT_DIR} {jobid} {path_to_job_outfile} {path_to_job_errfile}',
                     '-W', f'depend=afterany:{jobid}',
                     PATH_TO_CHECK_SCRIPT], stdout = f)

    submitted(jobid, jobname, username)


if __name__ == '__main__':

    path_to_subfile = sys.argv[1]
    submit_and_track(path_to_subfile)
