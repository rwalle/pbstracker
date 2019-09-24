#!/usr/bin/env python3

import sys
from .tracker_helper import finished

try:
    (status_code, reason, text) = finished(sys.argv[1], sys.argv[2], sys.argv[3])
    if status_code != 200:
        print(f'[PBSTracker] Cannot report finished status to the PBS tracker. Details: {text}', file=sys.stderr)

except Exception as e:
    print(f'[PBSTracker] Cannot report finished status to the PBS tracker. Details: {str(e)}', file=sys.stderr)
