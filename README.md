# PBS job status tracker

This is a tool that helps you track the PBS jobs submitted to an HPC cluster. After submitting jobs with `psub` command, the start/exit/finish status will be automatically reported to a website. Most importantly, this tool reports the stdout and stderr output of a job and marks those that have non empty stderr files, freeing users from manually checking the `.e*` files after jobs finish.

The toolkit provides a Python 3 client for submitting jobs on the HPC clusters, and a web server for viewing and managing jobs. The frontend of the web server uses [React](https://reactjs.org/). Two backends are provided, one written with [Django](https://www.djangoproject.com/) and [Django REST Framework](https://www.django-rest-framework.org/) and uses SQL database, the other written with [Express](https://expressjs.com/) and [Mongoose](https://mongoosejs.com/) and uses [mongoDB](https://www.mongodb.com/) as database.

A *read-only* [demo site](https://pbstracker-437ab.web.app/) using Express deployed on Google Firebase is provided.

The current version only supports TORQUE system.

## Example

```bash
$ psub analyze.sub
```

[Screenshot 1](https://i.imgur.com/ma6sHHY.png)   [Screenshot 2](https://i.imgur.com/qOeZwNz.png)

Test job files are placed under `test_subfiles` folder.

## Set up

You need to have basic python and Node.js knowledge to setup client and server, and may need to implement your own authentication protocols.

Instructions are in the `README.md` files under the folders.

[Python client setup](https://github.com/rwalle/pbstracker/blob/master/client/README.md)
[Express backend setup](https://github.com/rwalle/pbstracker/blob/master/server/backend/nodejs/README.md)
[Django backend setup](https://github.com/rwalle/pbstracker/blob/master/server/backend/django/README.md)


## How it works

When you submit a job, the tool (1) attaches prologue and epilogue scripts to the job and (2) reports the jobid to the server (3) automatically submits another "checking" script that "depends" on the original job. (i.e. only executes after the original script finishes) When the prologue script runs, it sends a "started" signal to the server. For epilogue script that is "exited" with an exit code. The "checking" scripts reads the stdout and stderr files and sends them to the server.

## To do

* UI improvement: add color to exit code, fonts, alignment
* improve Django consistency with Express server

## PBS Pro

PBSPro is not supported because it does not allow users to define their own `prologue` and `epilogue` scripts, although in principle one can modify the programs so that it submits a series of dependent jobs to send "start" and "finish" signals. However, additional jobs can add complexity to scheduling, and lead to fewer jobs being run for a user, especially on a busy queue. 
