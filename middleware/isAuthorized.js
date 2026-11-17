const isAuthorized = (req, res, next) => {
  const token = req.headers.cookie;

  // If a cookie header is provided, verify it matches 123987 (from Lecture 13)
  if (token && token !== "123987" && !token.includes("123987")) {
    return res.status(401).send("1:bro aap glt jigh ho");
  }
  next();
};

const isLoggedIn = (req, res, next) => {
  const login = true;
  if (!login) {
    return res.status(401).send("2:bro ye glt jigh h phir se");
  }
  next();
};

module.exports = { isAuthorized, isLoggedIn };
