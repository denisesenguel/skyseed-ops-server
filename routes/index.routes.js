const router = require("express").Router();
const authRoutes = require("./auth.routes");
const projectsRoutes = require("./projects.routes");
const customersRoutes = require("./customers.routes");

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", authRoutes);
router.use("/projects", projectsRoutes);
router.use("/customers", customersRoutes);

module.exports = router;
