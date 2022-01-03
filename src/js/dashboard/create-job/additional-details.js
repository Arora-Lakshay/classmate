import Notifier from "../../notify";

const inputs = document.querySelectorAll(".create-job main .form-area .form-container form .imp-contact .half-container fieldset .avalid.input");
const addDetailsForm = document.querySelector(".create-job main .form-area .form-container form#additional-details-form");
const submitButton = document.querySelector(".create-job main .form-area .back-forth-container .button.navigator#next-section-button");
const notifier = new Notifier();

let inputUpdateEvent = false;

inputs.forEach(input => {
  const feild = input.querySelector('input');

  feild.addEventListener('input', e => {
    inputUpdateEvent = true;
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

addDetailsForm.addEventListener("submit", e => {
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

function sendForm() {
  const FD = new FormData(addDetailsForm);
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
  if (inp.id === "additional-imp-contact-name" && inp.type === "text") {
    return inp.value.length >= 3 && inp.value.length <= 100;
  }
  if (inp.id === "additional-imp-contact-phone" && inp.type === "number") {
    const re = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return re.test(inp.value.toLowerCase());
  }
}

function validateForm() {
  let isVal = true;
  let allFilled = true;
  const name = document.querySelector(".create-job main .form-area .form-container form .imp-contact .half-container fieldset .avalid.input input#additional-imp-contact-name");
  const contact = document.querySelector(".create-job main .form-area .form-container form .imp-contact .half-container fieldset .avalid.input input#additional-imp-contact-phone");

  if (name.value && contact.value) {
    inputs.forEach(input => {
      const feild = input.querySelector('input');
      if (!isValid(feild)) {
        isVal = false;
      }
    });
  } else if (name.value || contact.value) {
    const notification = notifier.notify("error", "Complete all related feilds");
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

