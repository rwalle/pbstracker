#!/usr/bin/env python3

import re, os, datetime
import subprocess
from . import tracker_helper

DT_FORMAT = '%Y/%m/%d %H:%M:%S'


def sub_to_dict(path_to_subfile):

    pdict = {}

    with open(path_to_subfile, 'r') as infile:

        for line in infile.readlines():
            line = line.strip()
            m = re.match(r'#PBS -(\w) (.+)', line)
            if m:
                if m[1] == 'l':
                    m2 = re.match(r'^(\w+)=(.+)$', m[2])
                    if 'l' in pdict.keys():
                        pdict['l'][m2[1]] = m2[2]
                    else:
                        pdict['l'] = {m2[1]: m2[2]}
                else:
                    pdict[m[1]] = m[2]

    return pdict


def dict_to_sub(pdict):

    s = ''

    for key, value in pdict.items():
        if key != 'l':
            s = s + f'#PBS -{key} {value}' + os.linesep
        else:
            for key2, value2 in value.items():
                s = s + f'#PBS -l {key2}={value2}' + os.linesep

    return s


def is_file_empty(path_to_file):

    statinfo = os.stat(path_to_file)

    return statinfo.st_size == 0


def get_jobinfo_from_jobid(jobid):

    """
    obtain job information with 'qstat' command, and handles complicated with field with multiple lines, like

    Error_Path = halstead-a317.rcac.purdue.edu:/home/username/check/autocheck.e
    13796752

    """

    patterns = {
        'jobname': r'Job_Name += +([^ ]+) +[\w ]+ +=',
        'errpath': r'Error_Path += +[^ ]+:([^ ]+) +[\w ]+ +=',
        'outpath': r'Output_Path += +[^ ]+:([^ ]+) +[\w ]+ +=',
    }

    info = {}

    jobinfo = subprocess.check_output(['qstat', '-f', str(jobid)]).decode('utf8')

    for pattern_name in patterns:

        pattern = patterns[pattern_name]

        r = re.findall(pattern, jobinfo)

        if len(r) == 0:
            raise ValueError(f'Cannot find {pattern_name} information. Check if jobid is correct, and if the patterns match the output on your system.')

        info[pattern_name] = r[0].replace('\n', '').replace('\t', '')

    return info


