const Expense=require('../models/expenses');
const User=require('../models/user');
const AWS=require('aws-sdk');
const UserServices=require('../services/userServices');
const S3Services=require('../services/S3services.js');
const DownloadedFiles=require('../models/downloadedFiles')

const getExpenses=async(req,res,next)=>{
    //Expense.findAll({where:{userId:req.user.id}})
    // req.user.getExpenses().then(expenses => {
    //   console.log(expenses);
    //    res.status(200).json(expenses);
    // })
    // .catch(err => console.log(err));
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
      res.status(404).json(err);
  }
 };
 const deleteExpense = (req,res,next)=>{
   console.log(req);
    const id = req.params.expenseId;
    //console.log(id)
    Expense.findByPk(id)
    .then(expense => {
      //console.log(user);
      return expense.destroy();
    })
    .then(response => {
        res.status(202).json('Successfully Deleted');
    })
    .catch((err)=>{
        console.log(err)
    })
 };

 const addExpense = (req,res,next)=>{
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    console.log(req.user.id);
    Expense.create({
     amount:amount,
     description:description,
     category:category,
     userId:req.user.id
  })
  .then((response)=>{
    const totalExpense=Number(req.user.totalExpenses)+Number(amount);
    console.log(totalExpense);
    User.update({
      totalExpenses: totalExpense,
    },{where:{id:req.user.id}})
    .then(()=>{
      res.status(201).json({expense:response})
    })
    .catch((err)=>{
      return res.status(500).json({success:false,error:err})
    })
  })
  .catch((err)=> {
    return res.status(500).json({success:false,error:err})
  });
 };

 const downloadExpenses = async (req,res,next)=>{
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
    res.status(200).json({fileUrl,success:true});
  }
  catch(err){
    console.log(err)
    res.status(500).json({fileUrl:'',success:false,err:err})
  }
 }

 const getDownloads=async(req,res,next)=>{
  //console.log('DOWNLOADS',req.user.id);
  DownloadedFiles.findAll({where:{userId:req.user.id}}).then((downloads)=>{
    //console.log('DOWNLOADS',downloads);
    res.status(200).json(downloads);
  }).catch((err)=>console.log(err))
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

 


