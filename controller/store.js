const Home = require('../models/home');
const User = require('../models/user');
exports.getIndex = (req, res, next) => {
  console.log('session value:', req.session);
  Home.find().then(registeredhome=>{
    res.render("store/index", { registeredhome, pageTitle: "index",isLoggedIn: req.isLoggedIn,user:req.session.user, });
  });
};
exports.getHome = (req, res, next) => {
  Home.find().then(registeredhome=>{
    res.render("store/home", { registeredhome, pageTitle: "Airbnb" ,isLoggedIn: req.isLoggedIn,user:req.session.user,});
  });
};
exports.getBookings = (req, res, next) => {
  Home.find().then(registeredhome=>{
    res.render("store/bookings", { registeredhome, pageTitle: "Bookings" ,isLoggedIn: req.isLoggedIn,user:req.session.user,});
  });
};
exports.getFavourites = async(req, res, next) => {
  const userId= req.session.user._id;
  const user= await  User.findById(userId).populate('favourites');
  res.render("store/favourites", { favouriteHomes:user.favourites, pageTitle: "Favourites",isLoggedIn: req.isLoggedIn,user:req.session.user, });
  };
exports.postAddtofavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
    res.redirect("/favourites");
};
exports.postRemoveFromFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter(fav => fav != homeId);
    await user.save();
  }
    res.redirect("/favourites");
}
exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then(home => {
    if (!home) {
      console.log('Home not found');
      res.redirect('/home');
    } else {
      res.render('store/home-details', {
        home,
        pageTitle: "Home-details",
        isLoggedIn: req.isLoggedIn,user:req.session.user,
      });
    }
  });
};



