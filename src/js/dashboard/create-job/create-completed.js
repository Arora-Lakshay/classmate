import Notifier from "../../notify";

const preloader = document.querySelector(".create-job main .form-area .job-completed .job-preloader-container");
const success = document.querySelector(".create-job main .form-area .job-completed .job-completed-success");
const notifier = new Notifier();

async function saveJob(url) {
  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-cache',
    credentials: 'include'
  });
  return response.json();
}

saveJob('/api/in/save-job')
  .then(res => {
    if (res.success) {
      setTimeout(() => {
        preloader.style.display = "none";
        success.style.display = "flex";
      }, 5000);
      const successBtn = success.querySelector(".success-button button#success-redirect-button");
      successBtn.style.visibility = "visible";
      successBtn.addEventListener("click", e => {
        location.replace(res.jobUrl);
      });
    } else {
      const notification = notifier.notify("error", res.error.message);
      notification.push();
    }
  });
