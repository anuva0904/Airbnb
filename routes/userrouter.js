const express = require("express");
const userRouter = express.Router();
const storeController = require('../controller/store');

// Routes
userRouter.get("/", storeController.getIndex);
userRouter.get("/home", storeController.getHome);
userRouter.get("/bookings", storeController.getBookings);
userRouter.get("/favourites", storeController.getFavourites);
userRouter.get("/home/:homeId", storeController.getHomeDetails);
userRouter.post("/favourites", storeController.postAddtofavourite);
userRouter.post("/favourites/delete/:homeId", storeController.postRemoveFromFavourite);

module.exports = userRouter;
