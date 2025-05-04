// Core Module
const path = require('path');
//External module
const express =require("express");
const session=require("express-session");
const MongoDBStore=require("connect-mongodb-session")(session);
const { default:mongoose} = require('mongoose');
const multer = require('multer');
const dbPath='mongodbpath';


//local module
const userRouter = require("./routes/userrouter");
const authRouter = require("./routes/authRouter")
const {hostRouter} = require("./routes/hostrouter");
const errorController =require('./controller/error');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


const store =new MongoDBStore({
  uri:dbPath,
  collection:'sessions'
});
store.on('error', (error) => {
  console.error('Session store error:', error);
});
app.use((req,res,next)=>{
  console.log(req.url,req.method);
  next();
});

const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype ==='image/jpg' || file.mimetype ==='image/jpeg' || file.mimetype ==='image/png') {
    return cb(null, true);
  } else {
    cb(null, false);
  }
};

const multerOptions = {
  storage,fileFilter
};
app.use(express.urlencoded());
app.use(multer(multerOptions).single('photo'));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads" ,express.static(path.join(__dirname, 'uploads')));
app.use("/host/uploads" ,express.static(path.join(__dirname, 'uploads')));
app.use("/home/uploads" ,express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret:'Airbnbcode',
  resave:false,
  saveUninitialized:true,
  store:store
}));
app.use((req, res, next) => {
  //console.log('cookies check middleware');
 // req.isLoggedIn=req.get('Cookie')? req.get('Cookie').split('=')[1]==='true':false;
  req.isLoggedIn = req.session.isLoggedIn
  next();
})


app.use(authRouter);
app.use(userRouter);
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});
app.use("/host",hostRouter); 



app.use(errorController.pageNotFound);



const port =4000;

mongoose.connect(dbPath).then(()=>{
  console.log('connected to mongo');
  app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
  });
}).catch(err=>{
  console.log('error while connecting');
});




