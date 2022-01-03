import Notifier from "./notify";

const registerForm = document.querySelector('.form.register #auth-register-form');
const inputs = registerForm.querySelectorAll('fieldset .avalid.input');
const toggler = registerForm.querySelector('fieldset .input.avalid button.toggle');
const submitButton = registerForm.querySelector('button#register-submit');
const notifier = new Notifier();

inputs.forEach(input => {
  const feild = input.querySelector('input');
  const flag = input.querySelector('span');
  feild.addEventListener('input', e => {
    const valid = isValid(e.target);
    flag.className = valid ? "display" : "hidden";
  });
});

registerForm.querySelector('fieldset .avalid.input input#uid').addEventListener('keydown', e => {
  if (e.which === 38 || e.which === 40) {
    e.preventDefault();
  }
});

toggler.addEventListener('click', e => {
  const password = registerForm.querySelector('fieldset .avalid.input input#password');
  password.type = password.type === "text" ? "password" : "text";
  toggler.innerText = password.type === "text" ? "hide" : "show";
});

registerForm.addEventListener('submit', e => {
  e.preventDefault();
  submitButton.disabled = true;
  if (validateForm()) {
    sendForm();
  } else {
    submitButton.disabled = false;
  }
});

function sendForm() {
  const FD = new FormData(registerForm);
  const XHR = new XMLHttpRequest();

  XHR.addEventListener("load", (e) => {
    const res = JSON.parse(e.target.response);
    if (res.success) {
      location.replace('/login');
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

  XHR.open("POST", "/api/auth/register");
  XHR.send(FD);
}

function isValid(inp) {
  if (inp.id === "fname" && inp.type === "text") {
    const re = /^(?=.{3,30}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/i;
    return re.test(inp.value);
  }
  if (inp.id === "lname" && inp.type === "text") {
    const re = /^(?=.{3,30}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/i;
    return re.test(inp.value);
  }
  if (inp.id === "uid" && inp.type === "number") {
    return (inp.value >= 1000000 && inp.value <= 9999999);
  }
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
  registerForm.reset();
  inputs.forEach(input => {
    const flag = input.querySelector('span');
    flag.className = "hidden";
  });
  submitButton.disabled = false;
}
