/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!****************************************!*\
  !*** ./src/js/dashboard/create-job.js ***!
  \****************************************/
var goBackBtn = document.querySelector('.page.create-job main .navigation .goback button#goto-prev-page');
var logo = document.querySelector('.page.create-job header .logo .button#logo');
goBackBtn.addEventListener('click', function (e) {
  history.back();
});
logo.addEventListener('click', function (e) {
  location.href = '/';
});

if (stepsCompleted) {
  stepsCompleted.split(",").forEach(function (id) {
    var step = document.querySelector(".page.create-job main .navigation .progress-container nav.nav-menu ul li.nav-item div.nav-link#".concat(id));
    step.classList.add("completed");
  });
}

if (!statusDone) {
  var activeNavLinkBtn = document.querySelector(".page.create-job main .navigation .progress-container nav.nav-menu ul li.nav-item div.nav-link#".concat(activeNavLink));
  activeNavLinkBtn.classList.add("active");
}
/******/ })()
;