const { authenticatedUserDetail } = require("../middlewares/protectedRoute");

const {
  createLending,
  getLendings,
  updateLending,
  getLending,
  deleteLending,
  getMyLendings,
} = require("../src/controllers/lendingsController");
const router = require("express").Router();

router.post("/", authenticatedUserDetail, createLending);

router.get("/", authenticatedUserDetail, getLendings);

router.get("/my", authenticatedUserDetail, getMyLendings);

router.get("/:lendingId", authenticatedUserDetail, getLending);

router.patch("/:lendingId", authenticatedUserDetail, updateLending);

router.delete("/:lendingId", authenticatedUserDetail, deleteLending);

module.exports = router;
