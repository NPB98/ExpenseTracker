const Expense=require('../models/expenses');
const User=require('../models/user');
const AWS=require('aws-sdk');
const UserServices=require('../services/userServices');
const S3Services=require('../services/S3services.js');
const DownloadedFiles=require('../models/downloadedFiles');
const sequelize=require('../util/database');

const getExpenses=async(req,res,next)=>{
    //Expense.findAll({where:{userId:req.user.id}})
    // req.user.getExpenses().then(expenses => {
    //   console.log(expenses);
    //    res.status(200).json(expenses);
    // })
    // .catch(err => console.log(err));
    const t=await sequelize.transaction();
    try{
     console.log('Request',req.query);
      const page = req.query.page || 1;
      const rows=req.query.rows;
      const expensesPerPage = rows;
      const count = await Expense.count();
      //console.log(count);
    const expenses = await Expense.findAll({where:{userId:req.user.id},
      offset: (page-1) * expensesPerPage,
      limit: Number(expensesPerPage),
    });
    //console.log(expenses);
    await t.commit();
      res.status(201).json({
         expenses:expenses,
         currentPage: Number(page),
         hasNextPage:  expensesPerPage*page < count,
         nextPage:Number(page)+1,
         hasPreviousPage:Number(page)>1,
         previousPage:Number(page)-1,
         lastPage:Math.ceil(count/expensesPerPage)
      }); 
   }
  catch(err){
      await t.rollback();
      res.status(404).json(err);
  }
 };
 const deleteExpense =async (req,res,next)=>{
  const t=await sequelize.transaction();
   //console.log(req);
    const id = req.params.expenseId;
    //console.log(id)
    Expense.findByPk(id)
    .then(async(expense) => {
     //  console.log(expense);
      console.log(expense.userId);
      const destroyed =await expense.destroy();
      User.findByPk(expense.userId).then((expenses)=>{
        console.log(expenses);
        const totalExpen=expenses.dataValues.totalExpenses;
        console.log(totalExpen);
        const totalExpense=Number(totalExpen)-Number(expense.dataValues.amount);
        User.update({
          totalExpenses: totalExpense,
        },{where:{id:expense.userId},transaction:t}).then(()=>{
          t.commit();
        res.status(202).json('Successfully Deleted');
        })
      })
      //const totalExpense=Number(req.user.totalExpenses)-Number(req.dataValues.amount);
    })
    // .then(response => {
    //     t.commit();
    //     res.status(202).json('Successfully Deleted');
    //   })
    .catch((err)=>{
      t.rollback();
        console.log(err);
        res.status(500).json({message:"Failed",success:false});
    })
 };

 const addExpense = async(req,res,next)=>{
  const t=await sequelize.transaction();
  try{
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    console.log(req.user.id);
    const response=await Expense.create({
     amount:amount,
     description:description,
     category:category,
     userId:req.user.id
  },{transaction:t})
    const totalExpense=Number(req.user.totalExpenses)+Number(amount);
    console.log(totalExpense);
    await User.update({
      totalExpenses: totalExpense,
    },{where:{id:req.user.id},transaction:t})
      await t.commit();
      res.status(201).json({expense:response});
  }
  catch(err) {
    await t.rollback();
    return res.status(500).json({success:false,error:err})
  }
 };

 const downloadExpenses = async (req,res,next)=>{
  const t=await sequelize.transaction();
  try{
  const expenses=await UserServices.getExpenses(req);
    const stringifiedExpenses=JSON.stringify(expenses);
    const userId=req.user.id;
    const filename=`Expenses${userId}/${new Date()}.txt`;
    console.log(filename);
    const fileUrl = await S3Services.uploadToS3(stringifiedExpenses,filename);
    await DownloadedFiles.create({
      download:fileUrl,
      userId:req.user.id
    })
    await t.commit();
    res.status(200).json({fileUrl,success:true});
  }
  catch(err){
    await t.rollback();
    console.log(err)
    res.status(500).json({fileUrl:'',success:false,err:err})
  }
 }

 const getDownloads=async(req,res,next)=>{
  const t=await sequelize.transaction();
  try{
    //console.log('DOWNLOADS',req.user.id);
  const downloads=DownloadedFiles.findAll({where:{userId:req.user.id}})
  //console.log('DOWNLOADS',downloads);
  await t.commit();
  res.status(200).json(downloads);
  }
  catch(err){
    await t.rollback();
    console.log(err);
  }
  
  //console.log(req.user);
  // const downloads = await req.user.getDownloadedFiles();
  //     res.status(200).json(downloads);
 }
 module.exports={
  getExpenses,
  addExpense,
  deleteExpense,
  downloadExpenses,
  getDownloads
 }

 


