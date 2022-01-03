import Notifier from "../../notify";

const input = document.querySelector(".create-job main .form-area .form-container form fieldset .avalid.input");
const descriptionForm = document.querySelector(".create-job main .form-area .form-container form#job-description-form");
const submitButton = document.querySelector(".create-job main .form-area .back-forth-container .button.navigator#next-section-button");
const draftStatus = document.querySelector(".create-job main .form-area .form-container .step-count span.draft-status");
const notifier = new Notifier();

let inputUpdateEvent = false;
let draftData = {};
let timer;
let timeoutVal = 2000;

const feild = input.querySelector('textarea');

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
  draftData[e.target.name] = {
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

descriptionForm.addEventListener("submit", e => {
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

document.addEventListener('visibilitychange', e => {
  if (document.visibilityState === 'hidden') {
    saveAsDraft();
  }
});

function saveAsDraft() {
  const data = new Blob([JSON.stringify({ draftData })], { type: 'application/json' });
  navigator.sendBeacon('/api/in/draft/save', data);
}

function sendForm() {
  const FD = new FormData(descriptionForm);
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
  if (inp.id === "application-job-description") {
    return inp.value.length >= 100 && inp.value.length <= 5000;
  }
}

function validateForm() {
  let isVal = true;
  let allFilled = true;
  const feild = input.querySelector('textarea');
  if (!isValid(feild)) {
    isVal = false;
  }
  if (!isVal && allFilled) {
    const notification = notifier.notify("error", "Invalid details in one or more feilds");
    notification.push();
  } else if (!allFilled) {
    const notification = notifier.notify("error", "Complete all required feilds");
    notification.push();
  }
  return isVal;
}

