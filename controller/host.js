const Home =require('../models/home');
const fs=require('fs');
exports.getAddHome=((req,res,next)=>{
  res.render('host/edithome',{pageTitle : "Add-home", editing: false, isLoggedIn: req.isLoggedIn,user:req.session.user,});
  });
exports.postAddHome=((req,res,next)=>{
  const { houseName, price, location, rating,description} = req.body;
  console.log(houseName, price, location, rating,description);
  console.log(req.file);
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
    }

  const photo = req.file.path;
  const home = new Home({houseName, price, location, rating, photo,description});
  home.save().then(() => {
    console.log('Home Saved successfully');
  });
  res.redirect("/host/host-home-list");
});
exports.getHostHome =((req,res,next)=>{
  Home.find().then((registeredhome)=>{
    res.render("host/host-home-list",{registeredhome :registeredhome, pageTitle : "host-home-list",isLoggedIn: req.isLoggedIn, user:req.session.user,});
  });
});
exports.getEditHome=((req,res,next)=>{
  const homeId = req.params.homeId;
  const editing=req.query.editing ==='true';
  Home.findById(homeId).then(home => {
    if(!home){
      console.log('Home not found');
      return res.redirect('/host/host-home-list');
    }
    console.log(homeId,editing, home);
    res.render('host/edithome',{pageTitle : "Edit-home", editing: editing, home: home,isLoggedIn: req.isLoggedIn,user:req.session.user,});
  });
  });
exports.postEditHome=((req,res,next)=>{
  const { id, houseName, price, location, rating,description} = req.body;
  Home.findById(id).then(home=>{
    home.houseName= houseName;
    home.price= price;
    home.location= location;
    home.rating= rating;
    home.description= description;

    if(req.file){
      fs.unlink(home.photo, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully');
        }
      } );
      home.photo=req.file.path;
    }

  home.save().then(result => {
      console.log('Home updated ', result);
    }).catch(error=>{
        console.log(error);
        console.log('error while updating');
      }) 
      res.redirect('/host/host-home-list');
    }).catch(err=>{
      console.log('error while finding home',err);
    })
  });
  exports.postDeleteHome = (req, res, next) => {
    const homeId = req.params.homeId;
    console.log('Came to delete ', homeId);
    Home.findByIdAndDelete(homeId).then(()=>
    {res.redirect("/host/host-home-list")}).catch(error=>{
      console.log('error while deleting home', error);
    })
  };












