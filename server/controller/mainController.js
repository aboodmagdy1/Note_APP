//@desc   Get home page
//@route  GET /
//@access Public
exports.getHomePage = (req, res) => {
  const locals = {
    title: "NodeJs Notes",
    description: "NodeJs Notes App",
  };
  res.render("index", { locals ,layout : '../views/layouts/front-page.ejs' });
};
//@desc   Get about
//@route  GET /about
//@access Public
exports.getAboutPage = (req, res) => {
  const locals = {
    title: "About | NodeJs Notes",
    description: "NodeJs Notes App",
  };
  res.render("about", { locals});
};
