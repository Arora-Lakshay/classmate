const Draft = require("../models/Draft.model");
const { v4: uuidv4 } = require('uuid');
const createHttpError = require("http-errors");
const client = require("../helpers/redis.config");

exports.createJobSlot = async (req, res, next) => {
  try {
    if (!req.currentUser) {
      throw createHttpError.NotFound("User does not exist");
    }

    const jobSlot = uuidv4();

    const dd = {
      title: "Untitled",
      token: jobSlot,
      owner: req.currentUser.id,
      company: "Untitled"
    }
    const newDraft = await Draft.create(dd);
    await newDraft.save();

    return client.HMSET(`${process.env.JB_SLOT_KEY}:${req.currentUser.id}:${jobSlot}`,
      "currentStep", 101,
      "activeTab", 101,
      "prevTab", 0,
      "nextTab", 111,
      "basicDetails", 0,
      "eligibility", 0,
      "rounds", 0,
      "jobDescription", 0,
      "stipendSalary", 0,
      "additionalDetails", 0,
      "draftData", 0,
      (err, val) => {
        if (err) {
          console.log(err.message);
          return res.send(createHttpError.InternalServerError());
        }
        req.jobSlot = jobSlot;
        return next();
      }
    );
  } catch (error) {
    next(error);
  }
};
