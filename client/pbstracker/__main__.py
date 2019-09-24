#!/usr/bin/env python3

import sys
from .psub import submit_and_track

def main():

    path_to_subfile = sys.argv[1]
    submit_and_track(path_to_subfile)

if __name__ == '__main__':

    main()
