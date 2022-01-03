// Webpack Bundle Configurations...
const mix = require('laravel-mix');

/* JS Files */
mix.js('src/js/index.js', 'public/js');
mix.js('src/js/notify.js', 'public/js');
mix.js('src/js/login.js', 'public/js');
mix.js('src/js/register.js', 'public/js');
mix.js('src/js/home.js', 'public/js');
mix.js('src/js/error.js', 'public/js');
mix.js('src/js/dashboard.js', 'public/js');
mix.js('src/js/dashboard/index.js', 'public/js/dashboard');
mix.js('src/js/dashboard/jobs.js', 'public/js/dashboard');
mix.js('src/js/dashboard/notifications.js', 'public/js/dashboard');
mix.js('src/js/dashboard/messages.js', 'public/js/dashboard');
mix.js('src/js/dashboard/drafts.js', 'public/js/dashboard');
mix.js('src/js/dashboard/create-job.js', 'public/js/dashboard');
mix.js('src/js/dashboard/view-job.js', 'public/js/dashboard');
mix.js('src/js/dashboard/registerJob.js', 'public/js/dashboard');
mix.js('src/js/dashboard/regStudents.js', 'public/js/dashboard');
mix.js('src/js/dashboard/create-job/basic-details.js', 'public/js/dashboard/create-job');
mix.js('src/js/dashboard/create-job/eligibility.js', 'public/js/dashboard/create-job');
mix.js('src/js/dashboard/create-job/rounds.js', 'public/js/dashboard/create-job');
mix.js('src/js/dashboard/create-job/job-description.js', 'public/js/dashboard/create-job');
mix.js('src/js/dashboard/create-job/stipend-salary.js', 'public/js/dashboard/create-job');
mix.js('src/js/dashboard/create-job/additional-details.js', 'public/js/dashboard/create-job');
mix.js('src/js/dashboard/create-job/create-completed.js', 'public/js/dashboard/create-job');

/* SCSS Files */
mix.sass('src/scss/auth.scss', 'public/css');
mix.sass('src/scss/index.scss', 'public/css');
mix.sass('src/scss/home.scss', 'public/css');
mix.sass('src/scss/error.scss', 'public/css');
mix.sass('src/scss/notify.scss', 'public/css');
mix.sass('src/scss/dashboard.scss', 'public/css');
mix.sass('src/scss/dashboard/index.scss', 'public/css/dashboard');
mix.sass('src/scss/dashboard/jobs.scss', 'public/css/dashboard');
mix.sass('src/scss/dashboard/notifications.scss', 'public/css/dashboard');
mix.sass('src/scss/dashboard/messages.scss', 'public/css/dashboard');
mix.sass('src/scss/dashboard/drafts.scss', 'public/css/dashboard');
mix.sass('src/scss/dashboard/create-job.scss', 'public/css/dashboard');
mix.sass('src/scss/dashboard/view-job.scss', 'public/css/dashboard');
mix.sass('src/scss/dashboard/regStudents.scss', 'public/css/dashboard');
mix.sass('src/scss/dashboard/create-job/basic-details.scss', 'public/css/dashboard/create-job');
mix.sass('src/scss/dashboard/create-job/eligibility.scss', 'public/css/dashboard/create-job');
mix.sass('src/scss/dashboard/create-job/rounds.scss', 'public/css/dashboard/create-job');
mix.sass('src/scss/dashboard/create-job/job-description.scss', 'public/css/dashboard/create-job');
mix.sass('src/scss/dashboard/create-job/stipend-salary.scss', 'public/css/dashboard/create-job');
mix.sass('src/scss/dashboard/create-job/additional-details.scss', 'public/css/dashboard/create-job');
mix.sass('src/scss/dashboard/create-job/create-completed.scss', 'public/css/dashboard/create-job');
