import { format } from "morgan";
import Notifier from "../notify";

const applyNowBtn = document.querySelector('main.viewjob-wrapper .upper-banner .details-container .job-highlight a#apply-now-btn');
const markRegisterForm = document.querySelector('main.viewjob-wrapper .upper-banner .details-container form.mark-complete');
const markRegister = document.querySelector('main.viewjob-wrapper .upper-banner .details-container form.mark-complete button#mark-as-registered');
const notifier = new Notifier();

const arr = location.href.split("/");
const sid = arr[5];

applyNowBtn.addEventListener('click', e => {
  localStorage.setItem(sid, "true");
});

markRegisterForm.addEventListener("submit", e => {
  e.preventDefault();
  e.target.action = `/api/in/${sid}/register`;
  e.target.method = 'GET';
  e.target.submit();
});

// markRegister.addEventListener('click', e => {
//   const XHR = new XMLHttpRequest();

//   XHR.addEventListener("load", (e) => {
//     const res = JSON.parse(e.target.response);
//     if (res.registered) {
//       const notification = notifier.notify("success", `You have registered to this job`);
//       notification.push();
//     } else {
//       const notification = notifier.notify("error", "Sorry, Can't register at this moment");
//       notification.push();
//     }
//     location.reload();
//   });

//   XHR.addEventListener("error", (e) => {
//     const res = JSON.parse(e.target.response);
//     if (res.error) {
//       const notification = notifier.notify("error", "Something went wrong");
//       notification.push();
//     }
//   });

//   XHR.open("GET", `/in/api/${sid}/register`, true);
// });

if (localStorage.getItem(sid) === "true") {
  markRegister.classList.remove("notreg");
  markRegister.classList.add("canreg");
} else {
  markRegister.classList.remove("canreg");
  markRegister.classList.add("notreg");
}
