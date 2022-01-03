/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!************************!*\
  !*** ./src/js/home.js ***!
  \************************/
var logo = document.querySelector('.home header .logo button#logo');
var signIn = document.querySelector('.home header .options .item button#signin');
var getStarted = document.querySelector('.home header .options .item button#get-started');
var ctaBtn = document.querySelector('.home main .section .content.cta button#cta');
logo.addEventListener('click', function (e) {
  location.replace('/');
});
signIn.addEventListener('click', function (e) {
  location.href = '/login';
});
getStarted.addEventListener('click', function (e) {
  location.href = '/register';
});
ctaBtn.addEventListener('click', function (e) {
  location.href = '/login';
});
/******/ })()
;