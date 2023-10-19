const express = require("express");
const router = express.Router();
const { schemas } = require("../../models/contact");
const control = require("../../controllers/contacts");
const {
  validateBody,
  isValidId,
  authenticate,
  checkBody,
} = require("../../middlewares");

router.get("/", authenticate, control.getAll);

router.get("/:contactId", authenticate, isValidId, control.getById);

router.post(
  "/",
  authenticate,
  checkBody,
  validateBody(schemas.addSchema),
  control.add
);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  checkBody,
  validateBody(schemas.updateSchema),
  control.updateById
);

router.delete("/:contactId", authenticate, isValidId, control.removeById);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  control.updateStatusContact
);

module.exports = router;
