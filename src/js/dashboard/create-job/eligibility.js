import Notifier from "../../notify";

const inputs = document.querySelectorAll(".create-job main .form-area .form-container form fieldset .avalid.input");
const regEligForm = document.querySelector(".create-job main .form-area .form-container form#registration-eligibility-form");
const submitButton = document.querySelector(".create-job main .form-area .back-forth-container .button.navigator#next-section-button");
const chipInput = document.querySelector(".create-job main .form-area .form-container form fieldset .chipped.input");
const tabInput = document.querySelector(".create-job main .form-area .form-container form fieldset .tabbed.input");
const regModeFeild = document.querySelector(".create-job main .form-area .form-container form fieldset#reg-mode-action");
const draftStatus = document.querySelector(".create-job main .form-area .form-container .step-count span.draft-status");
const notifier = new Notifier();

let inputUpdateEvent = false;
let draftData = {
  tabs: {},
  inputs: {},
  chips: {}
};
let timer;
let timeoutVal = 2000;

tabInput.querySelectorAll(".wrap input[name='regMode']").forEach(inp => {
  inp.addEventListener("change", e => {
    inputUpdateEvent = true;
    const tab = tabInput.querySelector(".wrap input[name='regMode']:checked");
    draftData.tabs[tab.name] = {
      value: tab.value,
      inputId: tab.id
    };
    updateRegModeAction(tab.value);
  });
});

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

regEligForm.addEventListener("submit", e => {
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

const eligibility = [];

const chips = chipInput.querySelectorAll('.category-chip input');
chips.forEach(ch => {
  ch.addEventListener("change", e => {
    inputUpdateEvent = true;
    if (e.target.checked) {
      if (e.target.id === "eligibility-all" && e.target.value === "All") {
        deSelectAllChips(chips);
        eligibility.splice(0, eligibility.length);
      } else if (eligibility.includes("All")) {
        document.querySelector(".create-job main .form-area .form-container form fieldset .chipped.input .category-chip input#eligibility-all").checked = false;
        const i = eligibility.indexOf("All");
        eligibility.splice(i, 1);
      }
      eligibility.push(e.target.value);
    } else {
      const i = eligibility.indexOf(e.target.value);
      eligibility.splice(i, 1);
    }
  });
});

document.addEventListener('visibilitychange', e => {
  if (document.visibilityState === 'hidden') {
    saveAsDraft();
  }
});

function deSelectAllChips(chips) {
  chips.forEach(ch => {
    if (ch.id === "eligibility-all" && ch.value === "All") {
      ch.checked = true;
    } else {
      ch.checked = false;
    }
  });
}

function updateRegModeAction(mode) {
  if (mode === "url") {
    regModeFeild.querySelector("legend").innerText = "Registration URL ";
    const rqrd = document.createElement("span");
    rqrd.style.color = "orangered";
    rqrd.innerText = "*";
    regModeFeild.querySelector("legend").appendChild(rqrd);
    regModeFeild.querySelector(".tooltip span p").innerText = "Enter the valid registration link for your application";
    regModeFeild.querySelector(".avalid.input input").type = "url";
  } else if (mode === "email") {
    regModeFeild.querySelector("legend").innerText = "Registration Email ";
    const rqrd = document.createElement("span");
    rqrd.style.color = "orangered";
    rqrd.innerText = "*";
    regModeFeild.querySelector("legend").appendChild(rqrd);
    regModeFeild.querySelector(".tooltip span p").innerText = "Enter the valid registration email where you want to recieve application details";
    regModeFeild.querySelector(".avalid.input input").type = "email";
  }
}

function saveAsDraft() {
  draftData.chips["eligibility"] = {
    value: eligibility
  };
  const data = new Blob([JSON.stringify({ draftData })], { type: 'application/json' });
  navigator.sendBeacon('/api/in/draft/save', data);
}

function sendForm() {
  const FD = new FormData(regEligForm);
  FD.append("eligibility", JSON.stringify(eligibility));
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
  if (inp.id === "application-reg-action" && inp.type === "url") {
    const re = /(https?:\/\/)?([\da-z\.-]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/i;
    return re.test(inp.value.toLowerCase());
  }
  if (inp.id === "application-reg-action" && inp.type === "email") {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(inp.value);
  }
  if (inp.id === "application-start-time" && inp.type === "datetime-local") {
    const d1 = new Date();
    const d2 = new Date(inp.value);
    return d1.getTime() <= d2.getTime();
  }
  if (inp.id === "application-end-time" && inp.type === "datetime-local") {
    const start = document.querySelector(".create-job main .form-area .form-container form fieldset .avalid.input input#application-start-time");
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
  const checked = chipInput.querySelectorAll('.category-chip input:checked').length;
  if (!checked) {
    isVal = false;
    allFilled = false;
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

