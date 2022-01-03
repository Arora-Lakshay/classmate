import Notifier from "../../notify";

const inputs = document.querySelectorAll(".create-job main .form-area .form-container form fieldset .avalid.input");
const detailsForm = document.querySelector(".create-job main .form-area .form-container form#basic-details-form");
const submitButton = document.querySelector(".create-job main .form-area .back-forth-container .button.navigator#next-section-button");
const chipInputs = document.querySelectorAll(".create-job main .form-area .form-container form fieldset .chipped.input");
const draftStatus = document.querySelector(".create-job main .form-area .form-container .step-count span.draft-status");
const notifier = new Notifier();

let inputUpdateEvent = false;
let draftData = {
  draftname: "",
  inputs: {},
  chips: {}
};
let timer;
let timeoutVal = 2000;

inputs.forEach(input => {
  const feild = input.querySelector('input');

  // triggers a check to see if the user is actually done typing
  feild.addEventListener('keydown', e => {
    window.clearTimeout(timer);
    draftStatus.classList.remove("saved");
    draftStatus.classList.add("saving");
    draftStatus.innerText = "Saving...";
  });

  feild.addEventListener('keyup', e => {
    window.clearTimeout(timer); // prevent errant multiple timeouts from being generated
    timer = window.setTimeout(() => {
      saveAsDraft();
      draftStatus.classList.remove("saving");
      draftStatus.classList.add("saved");
      draftStatus.innerText = "Draft Saved";
    }, timeoutVal);
  });

  feild.addEventListener('input', e => {
    inputUpdateEvent = true;
    draftData.inputs[e.target.name] = {
      value: e.target.value,
      inputId: e.target.id
    };
    const valid = isValid(e.target);
    if (valid) {
      input.classList.remove("incorrect");
      input.classList.add("correct");
    } else {
      input.classList.remove("correct");
      input.classList.add("incorrect");
    }
  });
});

detailsForm.addEventListener("submit", e => {
  e.preventDefault();
  submitButton.disabled = true;
  submitButton.classList.add("disable");
  if (validateForm()) {
    sendForm();
  } else {
    submitButton.disabled = false;
    submitButton.classList.remove("disable");
  }
});

const jobDomains = [];
const jobCategories = [];

chipInputs.forEach(input => {
  const chips = input.querySelectorAll('.category-chip input');
  chips.forEach(ch => {
    ch.addEventListener("change", e => {
      inputUpdateEvent = true;
      if (e.target.checked) {
        if (input.id === "job-domains") {
          jobDomains.push(e.target.value);
        } else if (input.id === "job-categories") {
          jobCategories.push(e.target.value);
        }
      } else {
        if (input.id === "job-domains" && jobDomains.includes(e.target.value)) {
          const i = jobDomains.indexOf(e.target.value);
          jobDomains.splice(i, 1);
        } else if (input.id === "job-categories" && jobCategories.includes(e.target.value)) {
          const i = jobCategories.indexOf(e.target.value);
          jobCategories.splice(i, 1);
        }
      }
    });
  });
});

document.addEventListener('visibilitychange', e => {
  if (document.visibilityState === 'hidden') {
    saveAsDraft();
  }
});

function saveAsDraft() {
  draftData.draftname = draftData.inputs.jobTitle ? draftData.inputs.jobTitle.value : "Untitled";
  draftData.chips["jobDomains"] = {
    value: jobDomains
  };
  draftData.chips["jobCategories"] = {
    value: jobCategories
  };
  const data = new Blob([JSON.stringify({ draftData })], { type: 'application/json' });
  navigator.sendBeacon('/api/in/draft/save', data);
}

function sendForm() {
  const FD = new FormData(detailsForm);
  FD.append("jobDomains", JSON.stringify(jobDomains));
  FD.append("jobCategories", JSON.stringify(jobCategories));
  const XHR = new XMLHttpRequest();

  XHR.addEventListener("load", (e) => {
    const res = JSON.parse(e.target.response);
    if (res.success) {
      location.replace(res.redirect);
    } else {
      if (res.error.status === "JSM400" && res.error.custom) {
        location.replace("/in/create-job");
      } else {
        const notification = notifier.notify("error", res.error.message);
        notification.push();
        submitButton.disabled = false;
        submitButton.classList.remove("disable");
      }
    }
  });

  XHR.addEventListener("error", (e) => {
    const res = JSON.parse(e.target.response);
    if (res.error) {
      const notification = notifier.notify("error", "Something went wrong");
      notification.push();
    }
  });

  XHR.open("POST", "/api/in/create-job");
  XHR.send(FD);
}

function isValid(inp) {
  if (inp.id === "opportunity-title" && inp.type === "text") {
    return inp.value.length >= 3 && inp.value.length <= 200;
  }
  if (inp.id === "organisation-name" && inp.type === "text") {
    return inp.value.length >= 3 && inp.value.length <= 100;
  }
  if (inp.id === "organisation-website" && inp.type === "url") {
    const re = /(https?:\/\/)?([\da-z\.-]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/i;
    return re.test(inp.value.toLowerCase());
  }
  if (inp.id === "opportunity-start-time" && inp.type === "datetime-local") {
    const d1 = new Date();
    const d2 = new Date(inp.value);
    return d1.getTime() <= d2.getTime();
  }
  if (inp.id === "opportunity-end-time" && inp.type === "datetime-local") {
    const start = document.querySelector(".create-job main .form-area .form-container form fieldset .avalid.input input#opportunity-start-time");
    const d1 = new Date();
    const d3 = new Date(start.value);
    const d2 = new Date(inp.value);
    return d1.getTime() < d2.getTime() && d3.getTime() < d2.getTime();
  }
}

function validateForm() {
  let isVal = true;
  let allFilled = true;
  inputs.forEach(input => {
    const feild = input.querySelector('input');
    if (!isValid(feild)) {
      isVal = false;
    }
  });
  chipInputs.forEach(input => {
    const checked = input.querySelectorAll('.category-chip input:checked').length;
    if (!checked) {
      isVal = false;
      allFilled = false;
    }
  });
  if (!isVal && allFilled) {
    const notification = notifier.notify("error", "Invalid details in one or more feilds");
    notification.push();
  } else if (!allFilled) {
    const notification = notifier.notify("error", "Complete all required feilds");
    notification.push();
  }
  return isVal;
}

