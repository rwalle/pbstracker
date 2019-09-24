#PBS -S /bin/bash

cd "$1"
python3 report_finished.py "$2" "$3" "$4"