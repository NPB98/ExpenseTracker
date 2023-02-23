const express = require('express');
const app = express();
const helmet=require('helmet');
const morgan=require('morgan');
const fs=require('fs');
const path=require('path');
const dotenv=require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const cors = require('cors');
const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});
app.use(helmet());
app.use(morgan('combined'),{stream:accessLogStream});

const User = require('./models/user');
const Expense = require('./models/expenses');
const Order=require('./models/order');
const DownloadedFiles = require('./models/downloadedFiles');
const ForgotPassword =require('./models/forgotPassword');

const userRoute = require('./routes/login');
const expenseRoute = require('./routes/expense');
const orderRoute=require('./routes/purchase');
const premiumRoute=require('./routes/premium');
const forgotPasswordRoute = require('./routes/forgotPassword');


app.use(cors());

app.use(bodyParser.json());


app.use('/',userRoute);
app.use('/',expenseRoute);
app.use('/',orderRoute);
app.use('/',premiumRoute);
app.use('/',forgotPasswordRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

User.hasMany(DownloadedFiles);
DownloadedFiles.belongsTo(User);
sequelize.sync()
.then(result =>app.listen(4000))
.catch(err => console.log(err));