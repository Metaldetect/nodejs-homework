const express = require("express");
const router = express.Router();
const { validateBody } = require("../middlewares");
const schemas = require("../schemas/schema");
const control = require("../controllers/contacts");

router.get("/", control.getAll);

router.get("/:contactId", control.getById);

router.post("/", validateBody(schemas.addSchema), control.add);

router.put("/:contactId", validateBody(schemas.addSchema), control.updateById);

router.delete("/:contactId", control.removeById);

router.patch(
  "/:contactId/favorite",
  validateBody(schemas.updateFavoriteSchema),
  control.updateStatusContact
);

module.exports = router;
