const goBackBtn = document.querySelector('main.viewjob-wrapper .upper-banner .navigation .goback button#goto-prev-page');

goBackBtn.addEventListener('click', e => {
  history.back();
});