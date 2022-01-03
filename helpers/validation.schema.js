const Joi = require("joi");

// Validation Rules for User Registration...
exports.registerSchema = Joi.object({
  firstname: Joi.string().min(3).max(30).required(),
  lastname: Joi.string().min(3).max(30).required(),
  uid: Joi.number().min(1000000).max(9999999).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required()
});

// Validation Rules for User Logging-In...
exports.loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required()
});

// Validation Rules for creating Job Step - I (Basic Details)...
exports.basicDetailsSchema = Joi.object({
  jobTitle: Joi.string().min(3).max(200).required(),
  organisation: Joi.string().min(3).max(100).required(),
  website: Joi.string().lowercase().uri().required(),
  startDateTime: Joi.string().isoDate().required(),
  endDateTime: Joi.string().isoDate().required(),
  jobDomains: Joi.array().items(Joi.string().required()).required(),
  jobCategories: Joi.array().items(Joi.string().required()).required(),
});

// Validation Rules for creating Job Step - II (Registration & Eligibility)...
exports.regEligSchema = Joi.object({
  regMode: Joi.string().valid("url", "email").required(),
  regAction: Joi.when("regMode", {
    is: Joi.string().valid("url"),
    then: Joi.string().lowercase().uri().required(),
    otherwise: Joi.string().email().lowercase().required(),
  }),
  regStartDateTime: Joi.string().isoDate().required(),
  regEndDateTime: Joi.string().isoDate().required(),
  eligibility: Joi.array().items(Joi.string().required()).required(),
});

// Validation Rules for creating Job Step - III (Rounds)...
exports.roundsSchema = Joi.object({
  roundTitle: Joi.string().min(3).max(200).required(),
  roundDescription: Joi.string().min(25).max(2000).required(),
});

// Validation Rules for creating Job Step - IV (Job Description)...
exports.jobDescriptionSchema = Joi.object({
  jobDescription: Joi.string().min(100).max(5000).required(),
});

// Validation Rules for creating Job Step - V (Stipend & Salary)...
exports.stipendSalarySchema = Joi.object({
  jobSalary: Joi.string().min(3).max(1000).required(),
  jobType: Joi.string().valid("In-Office", "Work From Home").required(),
  jobTiming: Joi.string().valid("Full-Time", "Part-Time").required(),
  jobPerks: Joi.array().items(Joi.string().required()).required(),
});

// Validation Rules for creating Job Step - VI (Additional Schema)...
exports.addDetailsSchema = Joi.object({
  importantName: Joi.string().allow(null, "").required(),
  importantPhone: Joi.when("importantName", {
    is: Joi.string().min(1).required(),
    then: Joi.string().pattern(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/).required(),
    otherwise: Joi.string().allow(null, "").required(),
  }),
});
