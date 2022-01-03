const client = require("../helpers/redis.config");
const formidable = require("formidable");
const createHttpError = require("http-errors");
const { basicDetailsSchema, regEligSchema, roundsSchema, jobDescriptionSchema, stipendSalarySchema, addDetailsSchema } = require("../helpers/validation.schema");
const Job = require("../models/Job.model");
const Draft = require("../models/Draft.model");


exports.discardDraft = async (req, res, next) => {
  try {

    if (!req.currentUser) {
      throw createHttpError.NotFound("User does not exist");
    }

    const { darftId } = req.body;
    if (!darftId) {
      return res.send({
        error: {
          status: "400",
          message: "Invalid request to delete the draft"
        }
      });
    } else {
      return client.EXISTS(`${process.env.JB_SLOT_KEY}:${jobSlot}`, (err, val) => {
        if (err) {
          console.log(err.message);
          return res.send(createHttpError.InternalServerError());
        }

        if (!val) {
          return res.send({
            error: {
              status: "404",
              message: "Can't delete the Draft"
            }
          });
        } else {
          return client.DEL(`${process.env.JB_SLOT_KEY}:${darftId}`, (err, val) => {
            if (err) {
              console.log(err.message);
              return res.send(createHttpError.InternalServerError());
            }
            return res.sendStatus(200);
          });
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.saveDraft = async (req, res, next) => {
  try {

    if (!req.currentUser) {
      throw createHttpError.NotFound("User does not exist");
    }

    return client.HSET(`${process.env.JB_SLOT_KEY}:${req.currentUser.id}:${req.cookies[process.env.JB_SLOT_TAG]}`,
      "draftData", JSON.stringify(req.body.draftData),
      (err, val) => {
        if (err) {
          console.log(err.message);
        }
        return res.send({ success: true });
      }
    );
  } catch (error) {
    next(error);
  }
};

exports.registerJob = async (req, res, next) => {
  try {

    if (!req.currentUser) {
      throw createHttpError.NotFound("User does not exist");
    }

    const { token } = req.params;
    const getJob = await Job.findOne({ token });

    if (getJob) {
      await Job.updateOne({ token }, { "$push": { "registeredStudents": req.currentUser.id } });
    }

    return res.redirect(`/in/jobs/${token}/view`);

  } catch (error) {
    next(error);
  }
};

exports.saveJob = async (req, res, next) => {
  try {

    if (!req.currentUser) {
      throw createHttpError.NotFound("User does not exist");
    }

    const currentUser = req.currentUser;
    const jobSlot = req.cookies[process.env.JB_SLOT_TAG];

    return client.HGETALL(`${process.env.JB_SLOT_KEY}:${currentUser.id}:${jobSlot}`, async (err, resData) => {
      try {
        if (err) {
          console.log(err.message);
          return res.send(createHttpError.InternalServerError());
        }

        if (!Object.keys(resData).length || !resData.statusCompleted) {
          return res.send({
            error: {
              status: 400,
              message: "Something went wrong"
            }
          });
        }

        const template = {
          basicDetails: JSON.parse(resData.basicDetails),
          eligibilityDetails: JSON.parse(resData.eligibility),
          jobDetails: JSON.parse(resData.jobDescription),
          hiringProcess: { rounds: [] },
          salaryDetails: JSON.parse(resData.stipendSalary),
          additionalDetails: JSON.parse(resData.additionalDetails),
          token: jobSlot
        };

        const rds = JSON.parse(resData.rounds);
        Object.keys(rds.rounds).forEach(rd => {
          template.hiringProcess.rounds.push(rds.rounds[rd]);
        });

        let hasToken = await Job.findOne({ token: jobSlot });
        if (hasToken) {
          return res.send({
            error: {
              status: 400,
              message: "Invalid Job Configurations"
            }
          });
        }

        const newJob = await Job.create(template);
        await newJob.save();

        return res.send({ success: true, jobUrl: `/in/jobs/${newJob.token}/view` });
      } catch (err) {
        return res.send({
          error: {
            status: 500,
            message: err.message
          }
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createJobTemplate = async (req, res, next) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, feilds) => {
    try {
      if (err) {
        throw createHttpError.InternalServerError();
      }

      if (!req.currentUser) {
        throw createHttpError.NotFound("User does not exist");
      }

      return client.HGET(`${process.env.JB_SLOT_KEY}:${req.currentUser.id}:${req.cookies[process.env.JB_SLOT_TAG]}`, "currentStep", async (err, step) => {
        if (err) {
          console.log(err.message);
          return res.send(createHttpError.InternalServerError());
        }

        if (step <= 100) {
          res.clearCookie(process.env.JB_SLOT_TAG);
          return res.send({
            error: {
              status: "JSM400",
              custom: true,
              message: "Something went wrong"
            }
          });
        } else {
          step = Math.floor(step / 10);
          step = step % 10;

          try {
            const status = await Handlers[step](feilds, `${process.env.JB_SLOT_KEY}:${req.currentUser.id}:${req.cookies[process.env.JB_SLOT_TAG]}`, req.cookies[process.env.JB_SLOT_TAG]);
            return res.send(status);
          } catch (error) {
            next(error);
          }
        }
      });
    } catch (error) {
      throw next(error);
    }
  });
};

const Handlers = {

  0: async function (feilds, slot, slotId) {
    try {
      feilds.jobDomains = JSON.parse(feilds.jobDomains);
      feilds.jobCategories = JSON.parse(feilds.jobCategories);

      const result = await basicDetailsSchema.validateAsync(feilds);

      await Draft.updateOne({ token: slotId }, {
        title: result.jobTitle,
        company: result.organisation,
      });

      client.HMSET(slot,
        "currentStep", 111,
        "activeTab", 111,
        "prevTab", 101,
        "nextTab", 121,
        "basicDetails", JSON.stringify(result),
        "draftData", 0,
        (err, val) => {
          if (err) {
            console.log(err.message);
          }
          return val;
        }
      );
      return { success: true, redirect: `/in/create-job/${slotId}/edit` };
    } catch (error) {
      if (error.isJoi) {
        throw createHttpError.BadRequest("Inavlid details in one or more feilds");
      }
      throw error;
    }
  },

  1: async function (feilds, slot, slotId) {
    try {
      feilds.eligibility = JSON.parse(feilds.eligibility);

      const result = await regEligSchema.validateAsync(feilds);

      client.HMSET(slot,
        "currentStep", 121,
        "activeTab", 121,
        "prevTab", 111,
        "nextTab", 131,
        "eligibility", JSON.stringify(result),
        "draftData", 0,
        (err, val) => {
          if (err) {
            console.log(err.message);
          }
          return val;
        }
      );
      return { success: true, redirect: `/in/create-job/${slotId}/edit` };
    } catch (error) {
      if (error.isJoi) {
        throw createHttpError.BadRequest("Inavlid details in one or more feilds");
      }
      throw error;
    }
  },

  2: async function (feilds, slot, slotId) {
    try {
      feilds.rounds = JSON.parse(feilds.rounds);

      const keys = Object.keys(feilds.rounds);
      const result = {
        rounds: {},
      };

      if (!keys.length && !Object.keys(feilds.rounds[1]).length) {
        throw createHttpError.BadRequest("Required to include atleast one round");
      }

      let i = 1;
      for (rd of keys) {
        const out = await roundsSchema.validateAsync(feilds.rounds[rd]);
        result.rounds[i] = out;
        i = i + 1;
      }

      client.HMSET(slot,
        "currentStep", 131,
        "activeTab", 131,
        "prevTab", 121,
        "nextTab", 141,
        "draftData", 0,
        "rounds", JSON.stringify(result),
        (err, val) => {
          if (err) {
            console.log(err.message);
          }
          return val;
        }
      );

      return { success: true, redirect: `/in/create-job/${slotId}/edit` };
    } catch (error) {
      if (error.isJoi) {
        throw createHttpError.BadRequest("Inavlid details in one or more feilds");
      }
      throw error;
    }
  },

  3: async function (feilds, slot, slotId) {
    try {
      const result = await jobDescriptionSchema.validateAsync(feilds);

      client.HMSET(slot,
        "currentStep", 141,
        "activeTab", 141,
        "prevTab", 131,
        "nextTab", 151,
        "draftData", 0,
        "jobDescription", JSON.stringify(result),
        (err, val) => {
          if (err) {
            console.log(err.message);
          }
          return val;
        }
      );

      return { success: true, redirect: `/in/create-job/${slotId}/edit` };
    } catch (error) {
      if (error.isJoi) {
        throw createHttpError.BadRequest("Inavlid details in one or more feilds");
      }
      throw error;
    }
  },

  4: async function (feilds, slot, slotId) {
    try {
      feilds.jobPerks = JSON.parse(feilds.jobPerks);

      const result = await stipendSalarySchema.validateAsync(feilds);

      client.HMSET(slot,
        "currentStep", 151,
        "activeTab", 151,
        "prevTab", 141,
        "nextTab", 191,
        "draftData", 0,
        "stipendSalary", JSON.stringify(result),
        (err, val) => {
          if (err) {
            console.log(err.message);
          }
          return val;
        }
      );

      return { success: true, redirect: `/in/create-job/${slotId}/edit` };
    } catch (error) {
      if (error.isJoi) {
        throw createHttpError.BadRequest("Inavlid details in one or more feilds");
      }
      throw error;
    }
  },

  5: async function (feilds, slot, slotId) {
    try {

      let result = await addDetailsSchema.validateAsync(feilds);

      result = {
        importantContact: result
      }

      await Draft.deleteOne({ token: slotId });

      client.HMSET(slot,
        "currentStep", 191,
        "activeTab", 191,
        "prevTab", 0,
        "nextTab", 0,
        "draftData", 0,
        "statusCompleted", true,
        "additionalDetails", JSON.stringify(result),
        (err, val) => {
          if (err) {
            console.log(err.message);
          }
          return val;
        }
      );

      return { success: true, redirect: `/in/create-job/${slotId}/edit` };
    } catch (error) {
      if (error.isJoi) {
        throw createHttpError.BadRequest("Joi Inavlid details in one or more feilds");
      }
      throw error;
    }
  }
};
