const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const jobSchema = new Schema({
  basicDetails: {
    jobTitle: { type: String, required: true },
    organisation: { type: String, required: true },
    website: { type: String, required: true, lowercase: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    jobDomains: { type: Array, required: true },
    jobCategories: { type: Array, required: true }
  },
  eligibilityDetails: {
    regMode: { type: String, required: true },
    regAction: { type: String, required: true },
    regStartDateTime: { type: Date, required: true },
    regEndDateTime: { type: Date, required: true },
    eligibility: { type: Array, required: true },
  },
  hiringProcess: {
    rounds: [
      new Schema({
        roundTitle: { type: String, required: true },
        roundDescription: { type: String, required: true },
      })
    ],
  },
  jobDetails: {
    jobDescription: { type: String, required: true },
  },
  salaryDetails: {
    jobSalary: { type: String, required: true },
    jobType: { type: String, required: true },
    jobTiming: { type: String, required: true },
    jobPerks: { type: Array, required: true },
  },
  additionalDetails: {
    importantContact: {
      importantName: { type: String, default: "" },
      importantPhone: { type: Number, default: "" },
    },
  },
  token: {
    type: String,
    require: true,
    unique: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  registeredStudents: [
    {
      type: Schema.Types.ObjectId
    }
  ],
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
