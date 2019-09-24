
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const PBSJob = new Schema(
  {

    jobid: {type: String, unique: true, required: true},
    jobname: {type: String, index: true},
    username: {type: String, required: true},
    status: {type: Number, min:1, max: 5, required: true},
    // 1 = submitted 2 = started 3 = exited (finished, pending checking) 4 = finished 5 = finished with error
    submitted: Date,
    started: Date,
    finished: Date,
    exitcode: {type: Number, min:-12, max: 0},
    stderr: String,
    stdout: String,
    
    archived: {type: Boolean, index: true, required: true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("pbsjob", PBSJob);
