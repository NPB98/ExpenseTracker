const User=require('../models/user');
const Expense=require('../models/expenses');
const sequelize = require('../util/database');
 exports.getLeaderboard=async(req,res)=>{
    try{
        const leaderboardDetails = await User.findAll({
            //attributes:['id','name',[sequelize.fn('sum',sequelize.col('expenses.amount')),'total_cost']],
            // include:[
            //     {
            //         model:Expense,
            //         attributes:[]
            //     }
            // ],
            // group:['users.id'],
            order:[['totalExpenses',"DESC"]]
        });
        // const userTotalExpense = await Expense.findAll({
        //     attributes:['userId',sequelize.fn('sum',sequelize.col('expenses.amount')),'total_cost'],
        //     group:['userId']
        // });

        // const userTotalExpense=await Expense.findAll({
        //     attributes:['userId',sequelize.fn('sum',sequelize.col('expenses.amount')),'total_cost'],
        //     group:['userId']
        // }); 
    //     expenses.forEach((expense)=>{
    //         if(userTotalExpense[expense.userId]){
    //             userTotalExpense[expense.userId]+=Number(expense.amount);
    //         }
    //         else{
    //             userTotalExpense[expense.userId]=Number(expense.amount);
    //         }
    // })
    // let leaderboardDetails=[];
    // users.forEach((user)=>{
    //     leaderboardDetails.push({name:user.name, total_cost:userTotalExpense[user.id]||0});
    //    })
    //   leaderboardDetails.sort((a,b)=> b.total_cost-a.total_cost)

       res.status(200).json(leaderboardDetails);
    }
    catch(err){
        res.status(500).json(err);
    }
 }
 