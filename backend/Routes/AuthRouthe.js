const {
  Signup,
  Login,
  userVerification,
  Profile,
  Logout,
} = require("../Controllers/AuthController");
const {
  CreateOrder,
  GetHoldings,
  GetOrders,
  GetPositions,
  GetWatchlist,
  SaveWatchlist,
} = require("../Controllers/PortfolioController");
const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/profile", userVerification, Profile);
router.post("/logout", Logout);
router.get("/allHoldings", userVerification, GetHoldings);
router.get("/allPositions", userVerification, GetPositions);
router.get("/orders", userVerification, GetOrders);
router.post("/newOrder", userVerification, CreateOrder);
router.get("/watchlist", userVerification, GetWatchlist);
router.put("/watchlist", userVerification, SaveWatchlist);

module.exports = router;