import Notifier from "../../notify";

const roundsForm = document.querySelector(".create-job main .form-area .form-container form#rounds-form");
const addRoundBtn = document.querySelector(".create-job main .form-area .form-container .add-rounds button#add-new-round");
const submitButton = document.querySelector(".create-job main .form-area .back-forth-container .button.navigator#next-section-button");
let roundsCon = document.querySelectorAll(".create-job main .form-area .form-container form .round-container");
const notifier = new Notifier();

let inputUpdateEvent = false;
const rounds = {};
let total = roundsCon.length;

addRoundBtn.addEventListener("click", e => {
  total = total + 1;
  const htmlDom = (`
    <div class="round-container">
      <p class="round-count">
        ${total}. Tell more about this Round
      </p>
      <fieldset>
        <legend>
          Round Title
          <span style="color: orangered;">*</span>
        </legend>
        <div class="tooltip">
          <span>
            <code>i</code>
            <p>Enter any relevant title for this round</p>
          </span>
        </div>
        <div class="avalid input">
          <input class="round-title" name="roundTitle" required type="text" minlength="3" maxlength="200" autocomplete="off" />
        </div>
      </fieldset>
      <fieldset>
        <legend>
          Round Description
          <span style="color: orangered;">*</span>
        </legend>
        <div class="tooltip">
          <span>
            <code>i</code>
            <p>Enter the brief description for this round</p>
          </span>
        </div>
        <div class="avalid input">
          <input class="round-description" name="roundDescription" required type="text" minlength="25" maxlength="2000" autocomplete="off" />
        </div>
      </fieldset>
    </div>
  `);
  roundsForm.insertAdjacentHTML("beforeend", htmlDom);
  roundsCon = document.querySelectorAll(".create-job main .form-area .form-container form .round-container");
  rounds[total] = {};

  roundsCon.forEach(rd => {
    const inputs = rd.querySelectorAll("fieldset .avalid.input");
    inputs.forEach(input => {
      const feild = input.querySelector('input');

      feild.addEventListener('input', e => {
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
  });

  roundsCon.forEach((round, idx) => {
    const inputs = round.querySelectorAll("fieldset .avalid.input");
    inputs.forEach(inp => {
      const feild = inp.querySelector('input');
      feild.addEventListener("input", e => {
        if (isValid(e.target)) {
          rounds[idx + 1][e.target.name] = e.target.value;
        }
      });
    });
  });
});

roundsForm.addEventListener("submit", e => {
  e.preventDefault();
  submitButton.disabled = true;
  submitButton.classList.add("disable");
  if (validateForm(roundsCon)) {
    sendForm();
  } else {
    submitButton.disabled = false;
    submitButton.classList.remove("disable");
  }
});

function sendForm() {
  const FD = new FormData();
  FD.append("rounds", JSON.stringify(rounds));
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
  if (inp.className === "round-title" && inp.type === "text") {
    return inp.value.length >= 3 && inp.value.length <= 200;
  }
  if (inp.className === "round-description" && inp.type === "text") {
    return inp.value.length >= 25 && inp.value.length <= 2000;
  }
}

function validateForm(roundsCon) {
  let isVal = true;
  let allFilled = true;
  if (roundsCon.length) {
    roundsCon.forEach(rd => {
      const inputs = rd.querySelectorAll("feildset .avalid.input");
      inputs.forEach(input => {
        const feild = input.querySelector('input');
        if (!isValid(feild)) {
          isVal = false;
        }
      });
    });
  } else {
    const notification = notifier.notify("error", "Required to include atleast one round");
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