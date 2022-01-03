const createHttpError = require("http-errors");
const User = require("../models/User.model");
const Job = require("../models/Job.model");
const Draft = require("../models/Draft.model");
const client = require("../helpers/redis.config");

exports.dashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.aud);

    if (!user) {
      throw createHttpError.NotFound("User does not exist");
    }

    const options = {
      action: "index",
      active: "dashboard"
    }

    const data = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      uid: user.uid,
      role: user.role
    }

    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-state=0, post-check=0, pre-check=0');
    res.render("private/dashboard", { title: "Classmate | Dashboard", layout: "layouts/dashboard.ejs", user: data, options });
  } catch (error) {
    next(error);
  }
};

exports.jobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.aud);

    if (!user) {
      throw createHttpError.NotFound("User does not exist");
    }

    const options = {
      action: "jobs",
      active: "jobs"
    }

    const data = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      uid: user.uid,
      role: user.role
    }

    const jobs = await Job.find().sort({ createdAt: -1 });

    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-state=0, post-check=0, pre-check=0');
    res.render("private/jobs", { title: "Classmate | Jobs", layout: "layouts/dashboard.ejs", user: data, options, jobs });
  } catch (error) {
    next(error);
  }
};

exports.viewJob = async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.aud);
    const { token } = req.params;

    if (!user) {
      throw createHttpError.NotFound("User does not exist");
    }

    const aboutJob = await Job.findOne({ token });

    if (!aboutJob) {
      throw createHttpError.NotFound("Job does not exist");
    }

    let isRegistered = false;
    if (aboutJob.registeredStudents.indexOf(user.id) > -1) {
      isRegistered = true;
    }

    const data = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      uid: user.uid,
      role: user.role
    }

    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-state=0, post-check=0, pre-check=0');
    res.render("private/view-job", { title: `Job - ${aboutJob.basicDetails.organisation} is hiring`, isRegistered, user: data, aboutJob, style: "dashboard/view-job" });
  } catch (error) {
    next(error);
  }
};

exports.viewRegisteredStudents = async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.aud);
    const { token } = req.params;

    if (!user) {
      throw createHttpError.NotFound("User does not exist");
    }

    const aboutJob = await Job.findOne({ token });

    if (!aboutJob) {
      throw createHttpError.NotFound("Job does not exist");
    }

    const data = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      uid: user.uid,
      role: user.role
    }

    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-state=0, post-check=0, pre-check=0');
    res.render("private/regStudents", { title: `Job - ${aboutJob.basicDetails.organisation} registrations`, user: data, aboutJob, style: "dashboard/regStudents" });
  } catch (error) {
    next(error);
  }
};

exports.notifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.aud);

    if (!user) {
      throw createHttpError.NotFound("User does not exist");
    }

    const options = {
      action: "notifications",
      active: "notifications"
    }

    const data = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      uid: user.uid,
      role: user.role
    }

    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-state=0, post-check=0, pre-check=0');
    res.render("private/notifications", { title: "Classmate | Notifications", layout: "layouts/dashboard.ejs", user: data, options });
  } catch (error) {
    next(error);
  }
};

exports.messages = async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.aud);

    if (!user) {
      throw createHttpError.NotFound("User does not exist");
    }

    const options = {
      action: "messages",
      active: "messages"
    }

    const data = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      uid: user.uid,
      role: user.role
    }

    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-state=0, post-check=0, pre-check=0');
    res.render("private/messages", { title: "Classmate | Messages", layout: "layouts/dashboard.ejs", user: data, options });
  } catch (error) {
    next(error);
  }
};

exports.drafts = async (req, res, next) => {
  try {

    if (!req.currentUser) {
      throw createHttpError.NotFound("User does not exist");
    }

    const options = {
      action: "drafts",
      active: "drafts"
    }

    const data = {
      firstname: req.currentUser.firstname,
      lastname: req.currentUser.lastname,
      email: req.currentUser.email,
      uid: req.currentUser.uid,
      role: req.currentUser.role
    }

    // Fetch Drafts from database...
    const allDrafts = await Draft.find({ owner: req.currentUser.id });

    // Include drafts in response...

    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-state=0, post-check=0, pre-check=0');
    res.render("private/drafts", { title: "Classmate | Drafts", layout: "layouts/dashboard.ejs", user: data, options, allDrafts });

  } catch (error) {
    next(error);
  }
};

exports.createJob = async (req, res, next) => {
  try {
    if (!req.currentUser) {
      throw createHttpError.NotFound("User does not exist");
    }

    if (!req.jobSlot) {
      throw createHttpError.InternalServerError("JobSlot is missing");
    }

    const data = {
      firstname: req.currentUser.firstname,
      lastname: req.currentUser.lastname,
      email: req.currentUser.email,
      uid: req.currentUser.uid,
      role: req.currentUser.role
    }

    const options = {
      active: "basic-details",
      stepsDone: []
    }

    res.cookie(process.env.JB_SLOT_TAG, req.jobSlot, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-state=0, post-check=0, pre-check=0');
    return res.render("private/create-job/basic-details", { title: "Classmate | Create New Job Post", layout: "layouts/create-job.ejs", options, user: data });
  } catch (error) {
    next(error);
  }
};

exports.editJob = async (req, res, next) => {
  try {
    const currentUser = req.currentUser;
    const { jobSlot } = req.params;

    if (!req.currentUser) {
      throw createHttpError.NotFound("User does not exist");
    }

    return client.HMGET(`${process.env.JB_SLOT_KEY}:${currentUser.id}:${jobSlot}`, "currentStep", "draftData", (err, resData) => {
      if (err) {
        console.log(err.message);
        return res.send(createHttpError.InternalServerError());
      }

      let done = resData[0];
      let draftData = resData[1];

      if (done <= 100) {
        const options = {
          status: 404,
          title: "Looks like you're Lost",
          description: "The page you are looking for is not available !"
        }
        return res.render("public/error", { title: "Page Not Found", style: "error", options });
      } else {
        done = Math.floor(done / 10);
        done = done % 10;

        const data = {
          firstname: currentUser.firstname,
          lastname: currentUser.lastname,
          email: currentUser.email,
          uid: currentUser.uid,
          role: currentUser.role
        }

        const menu = ["basic-details", "eligibility", "rounds", "job-description", "stipend-salary", "additional-details"];

        let options = {};
        let renderPage = "";

        if (done === 9) {
          options = {
            active: "create-completed",
            stepsDone: menu,
            statusDone: true
          }
          renderPage = "create-completed";
        } else {
          options = {
            active: menu[done],
            stepsDone: menu.slice(0, done),
            containsDraftData: true,
            draftData: JSON.parse(draftData)
          }
          renderPage = menu[done];
        }

        res.cookie(process.env.JB_SLOT_TAG, jobSlot, {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-state=0, post-check=0, pre-check=0');
        return res.render(`private/create-job/${renderPage}`, { title: "Classmate | Create Job", layout: "layouts/create-job.ejs", options, user: data });
      }
    });
  } catch (error) {
    next(error);
  }
};
