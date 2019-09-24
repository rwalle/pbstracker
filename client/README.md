# Python client

This client works with Python 3. `requests` module is needed (automatically installed if you use `setup.py`)

It is recommended that you use the client using the Python binary files provided by the OS, unless Python 3 is not installed and you cannot install it yourself. If you use [virtualenv](https://virtualenv.pypa.io/en/latest/) or [Anaconda](https://www.anaconda.com/), you need to modify the scripts so that the correct Python interpreters are used.

Set up:

Run
```bash
python3 setup.py install
```
If you are a cluster user without root previledges, you may need to add the `--user` switch to install the module to your own home directory. (but not needed if you are using virtualenv or conda)

Then, prepare a `pbstracker_config.json` and place it under your home directory:
```json
{
    "auth": {
        "basic": {
            "user": "user",
            "pass": "pass"
        }
    },
    "api_root": "https://pbstracker-437ab.web.app/api",
    "tracker_log_dir": "/home/user/pbstracker_log/",
    "tracker_queue": "debug",
    "tracker_node": 24
}
```

`auth` can be `basic` or `bearer`. The parameters are:
```json
"basic": {
    "user": "user",
    "pass": "pass"
}
```
and
```json
"bearer": {
    "token": "fK8322fD84m"
}
```

`api_root` points to your API URL.

`tracker_log_dir` saves the stdout and stderr files of the "checking" jobs.

`tracker_queue` and `trakcer_node` are parameters for "checking" jobs.

After finishing the configurations, you can submit a job by running `psub` command (instead of the usual `qsub`):
```bash
psub myjob.job
```
