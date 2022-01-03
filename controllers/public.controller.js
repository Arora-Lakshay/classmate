exports.home = (req, res, next) => {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-state=0, post-check=0, pre-check=0');
  res.render("public/home", { title: "Classmate.org", style: "home" });
};

exports.login = (req, res, next) => {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-state=0, post-check=0, pre-check=0');
  res.render("auth/login", { title: "Classmate | Login", layout: "layouts/auth.ejs" });
};

exports.register = (req, res, next) => {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-state=0, post-check=0, pre-check=0');
  res.render("auth/register", { title: "Classmate | Register", layout: "layouts/auth.ejs" });
};
