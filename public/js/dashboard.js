/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*****************************!*\
  !*** ./src/js/dashboard.js ***!
  \*****************************/
var logo = document.querySelector('.page header .logo button#logo');
var dashboard = document.querySelector('.page header .navbar .menu .navitem#dashboard');
var jobs = document.querySelector('.page header .navbar .menu .navitem#jobs');
var notifications = document.querySelector('.page header .navbar .menu .navitem#notifications');
var messages = document.querySelector('.page header .navbar .menu .navitem#messages');
var logout = document.querySelector('.page header .navbar .options .navitem#logout');
logo.addEventListener("click", function (e) {
  location.replace("/");
});
dashboard.addEventListener("click", function (e) {
  location.href = "/in/dashboard";
});
jobs.addEventListener("click", function (e) {
  location.href = "/in/jobs";
});
notifications.addEventListener("click", function (e) {
  location.href = "/in/notifications";
});
messages.addEventListener("click", function (e) {
  location.href = "/in/messages";
});
logout.addEventListener("click", function (e) {
  location.replace("/api/auth/logout");
});

if (activeLink) {
  document.querySelector(".page header .navbar .menu .navitem#".concat(activeLink)).classList.add("active");
}
/******/ })()
;