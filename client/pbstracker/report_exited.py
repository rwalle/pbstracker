#!/usr/bin/env python3

import sys
from .tracker_helper import exited

try:
    (status_code, reason, text) = exited(sys.argv[1], sys.argv[10])
    if status_code != 200:
        print(f'[PBSTracker] Cannot report exited status to the PBS tracker. Details: {text}', file=sys.stderr)

except Exception as e:
    print(f'[PBSTracker] Cannot report exited status to the PBS tracker. Details: {str(e)}', file=sys.stderr)
