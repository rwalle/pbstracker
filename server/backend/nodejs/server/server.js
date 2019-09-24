const mongoose = require('mongoose');
const express = require('express');
const basicAuth = require('express-basic-auth');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const PBSJob = require('./data');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

const dbRoute =
  'mongodb://localhost:27017/pbstracker';

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(dbRoute);

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use(basicAuth({
  users: {
      'user': 'pass',
  }
}))

router.get('/', (req, res) => {

  var query = {};
  var { show_archived, username, jobname } = req.query;

  if ( !show_archived ) { query.archived = false; }
  if ( username ) { query.username = new RegExp(username, 'i');}
  if ( jobname ) { query.jobname = new RegExp(jobname, 'i');}

  PBSJob.find(query, 'jobid jobname username status submitted started finished archived exitcode', (err, data) => {
    if (err) return res.json({ error: err });
    return res.json(data);
  });

});

router.post('/', (req, res) => {
  const { jobid, jobname, username } = req.body;

  if (jobid == undefined || jobname == undefined || username == undefined)
    {return res.status(400).json({success: false, error: 'Invalid inputs'});}

  let job = new PBSJob();
  job.jobid = jobid;
  job.jobname = jobname;
  job.username = username;
  job.status = 1;
  job.submitted = Date.now();
  job.archived = false;

  job.save((err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });

});

router.get('/:jobid/', (req, res) => {

  const { jobid } = req.params;

  PBSJob.findOne({ jobid: jobid}, (err, job) => {
    if (err) return res.status(500).json({error: err});
    if (!job) {
      return res.status(404).json({ success: false, error: `job ${jobid} does not exist`});
    }
    return res.json(job);

  });


});

router.post('/:jobid/started/', (req, res) => {

  const { jobid } = req.params;

  PBSJob.findOneAndUpdate({ jobid: jobid}, {started: Date.now(), status:2}, (err, job) => {
    if (err) return res.json({success: false, error: err});
    if (!job) {
      return res.status(404).json({ success: false, error: `job ${jobid} does not exist`});
    }
    return res.json({success: true, data: job})

  })

});

router.post('/:jobid/exited/', (req, res) => {

  const { jobid } = req.params;
  const { exitcode } = req.body;

  if (exitcode == undefined) {return res.status(400).json({success: false, error: 'Invalid inputs'});}

  PBSJob.findOneAndUpdate({ jobid: jobid}, {finished: Date.now(), status:3, exitcode: exitcode}, (err, job) => {
    if (err) return res.json({success: false, error: err});
    if (!job) {
      return res.status(404).json({ success: false, error: `job ${jobid} does not exist`});
    }
    return res.json({success: true, data: job})

  })

});

router.post('/:jobid/finished/', (req, res) => {

  const { jobid } = req.params;
  const { stdout, stderr } = req.body;

  if (stdout == undefined || stderr == undefined) {return res.status(400).json({success: false, error: 'Invalid inputs'});}

  var exit_status = 0;

  if (stderr == '') { exit_status = 4; } else { exit_status = 5; }

  PBSJob.findOneAndUpdate({ jobid: jobid}, {status: exit_status, stderr: stderr, stdout: stdout}, (err, job) => {
    if (err) return res.json({success: false, error: err});
    if (!job) {
      return res.status(404).json({ success: false, error: `job ${jobid} does not exist`});
    }
    return res.json({success: true, data: job})

  })

});

router.post('/:jobid/archive/', (req, res) => {

  const { jobid } = req.params;

  PBSJob.findOneAndUpdate({ jobid: jobid}, {archived: true}, (err, job) => {
    if (err) return res.json({success: false, error: err});
    if (!job) {
      return res.status(404).json({ success: false, error: `job ${jobid} does not exist`});
    }
    return res.json({success: true, data: job})

  })

});

router.post('/:jobid/unarchive/', (req, res) => {

  const { jobid } = req.params;

  PBSJob.findOneAndUpdate({ jobid: jobid}, {archived: false}, (err, job) => {
    if (err) return res.json({success: false, error: err});
    if (!job) {
      return res.status(404).json({ success: false, error: `job ${jobid} does not exist`});
    }
    return res.json({success: true, data: job})

  })

});


router.delete('/:jobid/', (req, res) => {
  const {jobid} = req.params;
  PBSJob.findOneAndDelete({jobid: jobid}, (err, job) => {
    if (err) return res.send(err);
    if (!job) {
      return res.status(404).json({ success: false, error: `job ${jobid} does not exist`});
    }
    return res.json({ success: true });
  });
});


app.use('/api', router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
