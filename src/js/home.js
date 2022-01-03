const logo = document.querySelector('.home header .logo button#logo');
const signIn = document.querySelector('.home header .options .item button#signin');
const getStarted = document.querySelector('.home header .options .item button#get-started');
const ctaBtn = document.querySelector('.home main .section .content.cta button#cta');

logo.addEventListener('click', e => {
  location.replace('/');
});

signIn.addEventListener('click', e => {
  location.href = '/login';
});

getStarted.addEventListener('click', e => {
  location.href = '/register';
});

ctaBtn.addEventListener('click', e => {
  location.href = '/login';
});
