const logo = document.querySelector('.page header .logo button#logo');
const dashboard = document.querySelector('.page header .navbar .menu .navitem#dashboard');
const jobs = document.querySelector('.page header .navbar .menu .navitem#jobs');
const notifications = document.querySelector('.page header .navbar .menu .navitem#notifications');
const messages = document.querySelector('.page header .navbar .menu .navitem#messages');
const logout = document.querySelector('.page header .navbar .options .navitem#logout');

logo.addEventListener("click", e => {
  location.replace("/");
});

dashboard.addEventListener("click", e => {
  location.href = "/in/dashboard";
});

jobs.addEventListener("click", e => {
  location.href = "/in/jobs";
});

notifications.addEventListener("click", e => {
  location.href = "/in/notifications";
});

messages.addEventListener("click", e => {
  location.href = "/in/messages";
});

logout.addEventListener("click", e => {
  location.replace("/api/auth/logout");
});

if (activeLink) {
  document.querySelector(`.page header .navbar .menu .navitem#${activeLink}`).classList.add("active");
}
