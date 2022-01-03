import Notifier from "./notify";

const loginForm = document.querySelector('.form.login #auth-login-form');
const inputs = loginForm.querySelectorAll('fieldset .avalid.input');
const toggler = loginForm.querySelector('fieldset .input.avalid button.toggle');
const submitButton = loginForm.querySelector('button#login-submit');
const notifier = new Notifier();

inputs.forEach(input => {
  const feild = input.querySelector('input');
  const flag = input.querySelector('span');
  feild.addEventListener('input', e => {
    const valid = isValid(e.target);
    flag.className = valid ? "display" : "hidden";
  });
});

toggler.addEventListener('click', e => {
  const password = loginForm.querySelector('fieldset .avalid.input input#password');
  password.type = password.type === "text" ? "password" : "text";
  toggler.innerText = password.type === "text" ? "hide" : "show";
});

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  submitButton.disabled = true;
  if (validateForm()) {
    sendForm();
  } else {
    submitButton.disabled = false;
  }
});

function sendForm() {
  const FD = new FormData(loginForm);
  const XHR = new XMLHttpRequest();

  XHR.addEventListener("load", (e) => {
    const res = JSON.parse(e.target.response);
    if (res.success) {
      location.replace('/in/dashboard');
    } else {
      const notification = notifier.notify("error", res.error.message);
      notification.push();
      submitButton.disabled = false;
    }
  });

  XHR.addEventListener("error", (e) => {
    const res = JSON.parse(e.target.response);
    if (res.error) {
      const notification = notifier.notify("error", "Something went wrong");
      notification.push();
    }
  });

  XHR.open("POST", "/api/auth/login");
  XHR.send(FD);
}

function isValid(inp) {
  if (inp.id === "email" && inp.type === "email") {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(inp.value);
  }
  if (inp.id === "password") {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return re.test(inp.value);
  }
}

function validateForm() {
  let isVal = true;
  inputs.forEach(input => {
    const feild = input.querySelector('input');
    if (!isValid(feild)) {
      isVal = false;
    }
  });
  if (!isVal) {
    const notification = notifier.notify("error", "Invalid details in one or more feilds");
    notification.push();
  }
  return isVal;
}

function resetForm() {
  loginForm.reset();
  inputs.forEach(input => {
    const flag = input.querySelector('span');
    flag.className = "hidden";
  });
  submitButton.disabled = false;
}
