import Notifier from "../../notify";

const sinput = document.querySelector(".create-job main .form-area .form-container form fieldset .avalid.input");
const salaryForm = document.querySelector(".create-job main .form-area .form-container form#salary-stipend-form");
const submitButton = document.querySelector(".create-job main .form-area .back-forth-container .button.navigator#next-section-button");
const chipInputs = document.querySelectorAll(".create-job main .form-area .form-container form fieldset .chipped.input");
const radioInputs = document.querySelectorAll(".create-job main .form-area .form-container form fieldset .radio.input");
const notifier = new Notifier();

let inputUpdateEvent = false;

const feild = sinput.querySelector('textarea');
feild.addEventListener('input', e => {
  inputUpdateEvent = true;
  const valid = isValid(e.target);
  if (valid) {
    sinput.classList.remove("incorrect");
    sinput.classList.add("correct");
  } else {
    sinput.classList.remove("correct");
    sinput.classList.add("incorrect");
  }
});

salaryForm.addEventListener("submit", e => {
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

const jobPerks = [];

chipInputs.forEach(input => {
  const chips = input.querySelectorAll('.category-chip input');
  chips.forEach(ch => {
    ch.addEventListener("change", e => {
      inputUpdateEvent = true;
      if (e.target.checked) {
        jobPerks.push(e.target.value);
      } else {
        const i = jobPerks.indexOf(e.target.value);
        jobPerks.splice(i, 1);
      }
    });
  });
});

function sendForm() {
  const FD = new FormData(salaryForm);
  FD.append("jobPerks", JSON.stringify(jobPerks));
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
  if (inp.id === "job-stipend-salary") {
    return inp.value.length >= 3 && inp.value.length <= 1000;
  }
}

function validateForm() {
  let isVal = true;
  let allFilled = true;
  const feild = sinput.querySelector('textarea');
  if (!isValid(feild)) {
    isVal = false;
  }
  chipInputs.forEach(input => {
    const checked = input.querySelectorAll('.category-chip input:checked').length;
    if (!checked) {
      isVal = false;
      allFilled = false;
    }
  });
  let lnth = [false, false];
  radioInputs.forEach((input, i) => {
    lnth[i] = input.querySelectorAll("input:checked").length ? true : false;
  });
  if (!lnth[0] || !lnth[1]) {
    const notification = notifier.notify("error", "Complete all required feilds");
    notification.push();
    return false;
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

