const goBackBtn = document.querySelector('.page.create-job main .navigation .goback button#goto-prev-page');
const logo = document.querySelector('.page.create-job header .logo .button#logo');

goBackBtn.addEventListener('click', e => {
  history.back();
});

logo.addEventListener('click', e => {
  location.href = '/';
});

if (stepsCompleted) {
  stepsCompleted.split(",").forEach(id => {
    const step = document.querySelector(`.page.create-job main .navigation .progress-container nav.nav-menu ul li.nav-item div.nav-link#${id}`);
    step.classList.add("completed");
  });
}

if (!statusDone) {
  const activeNavLinkBtn = document.querySelector(`.page.create-job main .navigation .progress-container nav.nav-menu ul li.nav-item div.nav-link#${activeNavLink}`);
  activeNavLinkBtn.classList.add("active");
}
