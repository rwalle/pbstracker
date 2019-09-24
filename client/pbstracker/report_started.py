#!/usr/bin/env python3

import sys
from .tracker_helper import started

try:
    (status_code, reason, text) = started(sys.argv[1])
    if status_code != 200:
        print(f'[PBSTracker] Cannot report started status to the PBS tracker. Details: {text}', file=sys.stderr)

except Exception as e:
    print(f'[PBSTracker] Cannot report started status to the PBS tracker. Details: {str(e)}', file=sys.stderr)
