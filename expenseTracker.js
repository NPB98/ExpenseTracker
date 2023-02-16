//const jwt= require("jsonwebtoken");

var amt=document.getElementById('amount');
var desc=document.getElementById('description');
var cate=document.getElementById('category');
var itemlist=document.getElementById('items');
var form=document.getElementById('addForm');
form.addEventListener("submit",addExpense)
//premium.addEventListener("submit",window.location.href='https://github.com/NPB98/Pr/commits/main');


function addExpense(e){
    e.preventDefault();
    const obj = {
        amount:amt.value,
        description:desc.value,
        category:cate.value
    }
    const token=localStorage.getItem('token');
    console.log(token);
    axios.post("http://localhost:4000/addExpenses",obj,{headers:{'Authorization':token}})
    .then((response)=>{
        showExpensesOnScreen(obj);
    }).catch((err)=>console.log(err));
}

function showPremiumUser(){
    document.getElementById('rzp-button1').style.visibility='hidden';
    document.getElementById('premium').innerHTML = 'You are premium user' ;
    const downloadFacility=document.getElementById("downloadFacility");
    const childNode=`<div class="container">
    <button onclick="download()" id="downloadOption">Download File</button>
  </div>`
  downloadFacility.innerHTML+=childNode;
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}
function Helper(e){
    e.preventDefault();
      const rows = document.getElementById('row');
      localStorage.setItem('rows',rows.value);
     console.log(rows.value);
      getExpense(1);
  }

window.addEventListener("DOMContentLoaded",(e)=>{
    const token=localStorage.getItem('token');
    const decodedToken=parseJwt(token);
    const isPremiumUser=decodedToken.isPremiumUser;
    if(isPremiumUser){
        showPremiumUser();
        showLeaderboard();
    }
    // const page = 1;
    // axios.get(`http://localhost:4000/getExpenses?page=${page}`, { headers: {"Authorization": token}})
    // .then((response)=>{
    //     const expenses=response.data;
    //     for(let i=0; i<response.data.length; i++){
    //         //console.log(response.data[i]);
    //         showExpensesOnScreen(response.data[i]);
    //        }
    //        showPagination(response.data.pageData)
    // })
//     axios.get("http://localhost:4000/getExpenses",{headers:{'Authorization':token}})
//     .then((response)=>{
//    for(let i=0; i<response.data.length; i++){
//     //console.log(response.data[i]);
//     showExpensesOnScreen(response.data[i]);
//    }
   //.catch((err)=> console.log(err))
   console.log('downloads');
   axios.get("http://localhost:4000/getDownloads", { headers: {"Authorization": token}})
     .then((downloads)=>{
        //console.log('DOWNloads',downloads);
    const listItem = document.getElementById("getDownloads");
    //console.log('List item',listItem);
    for(let i=0; i<downloads.data.length; i++){
        //console.log('Innerhtml',listItem.innerHTML);
      listItem.innerHTML += `<li>${downloads.data[i].download}</li>`
    }
}).catch((err)=>{
    console.log(err);
})
})
async function getExpense(page){
    const token = localStorage.getItem('token');
    const rows = localStorage.getItem('rows');
    //console.log(rows);
   const Expenses =  await axios.get(`http://localhost:4000/getExpenses?page=${page}&rows=${rows}`,{ headers: {"Authorization": token}});
   console.log(Expenses);
   const expenses= Expenses.data.expenses;
   console.log(expenses.length);
   for(let i=0; i<expenses.length; i++){
        showExpensesOnScreen(expenses[i]);
     }
     console.log(Expenses.data);
     showPagination(Expenses.data);
 }

function showPagination(response){
    console.log('Response',response);
    const currentPage = response.currentPage;
    const hasNextPage = response.hasNextPage;
    const nextPage = response.nextPage;
    const hasPreviousPage = response.hasPreviousPage;
    const previousPage = response.previousPage;
    const lastPage = response.lastPage;
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = " ";
  if(hasPreviousPage){
    const btn2 = document.createElement('button');
    btn2.innerHTML = previousPage;
    btn2.addEventListener('click', ()=> getExpense(previousPage));
    pagination.appendChild(btn2);
  }
  const btn1 = document.createElement('button');
  btn1.innerHTML = `<h3>${currentPage}</h3>`;
  btn1.addEventListener('click', ()=> getExpense(currentPage));
  pagination.appendChild(btn1);
  if(hasNextPage){
    const btn3 = document.createElement('button');
    btn3.innerHTML = nextPage;
    btn3.addEventListener('click', ()=> getExpense(nextPage));
    pagination.appendChild(btn3);
  }
 }
  
function showExpensesOnScreen(item){
    const parentNode= document.getElementById('items');
    //console.log(parentNode);
    const childHTML = `<li id=${item.id}> Expense Amount: ${item.amount}, Category: ${item.category}, Description: ${item.description}
                        <button onclick=deleteExpense('${item.id}')>Delete</button>
                        </li>`;
    parentNode.innerHTML = parentNode.innerHTML+childHTML;
}

function deleteExpense(expenseId){
    //console.log(expenseId);
    const token=localStorage.getItem('token');
    axios.get(`http://localhost:4000/deleteExpense/${expenseId}`,{headers:{'Authorization':token}})
    .then((response)=>{
        const parentNode = document.getElementById('items');
        const childNodeToBeDeleted = document.getElementById(expenseId);
        if(childNodeToBeDeleted){
            parentNode.removeChild(childNodeToBeDeleted)
        }
    }).catch((err)=>console.log(err));
}

function download(){
    const token = localStorage.getItem('token');
    axios.get("http://localhost:4000/download",{ headers: {"Authorization": token}})
    .then((response)=>{
        //console.log(response.data.fileUrl);
        //console.log(response.status);
      if(response.status === 200){
        let a = document.createElement('a');
        a.href = response.data.fileUrl;
        //console.log(a);
        a.download = 'myexpense.csv';
        a.click();
      }else{
         throw new Error(response.data.message);
      }
    })
    .catch((err)=>{
        document.body.innerHTML += `<div class="container"style="color:red;"> ${err}</div>`
    })
 }

function showLeaderboard(){
    const inputElement = document.createElement('input');
    inputElement.type = "button";
    inputElement.value = "Show Leaderboard";
    inputElement.onclick = async() => {
        const token = localStorage.getItem('token');
       const leaderboardArray = await axios.get("http://localhost:4000/showLeaderboard", { headers: {"Authorization": token}});
        let leaderboardElem = document.getElementById('leaderboard');
        leaderboardElem.innerHTML += '<div class="container"><h3> LeaderBoard </h1></div>'

        leaderboardArray.data.forEach((userDetails) => {
            leaderboardElem.innerHTML += `<div class='container'><li>Name - ${userDetails.name} Total Expense-${userDetails.totalExpenses}</div>`
        })
    }
    document.getElementById('premium').appendChild(inputElement)
 }

document.getElementById('rzp-button1').onclick=async function(e){
    const token=localStorage.getItem('token');
    console.log(token);
    const response=await axios.get('http://localhost:4000/premiumMembership',{headers:{'Authorization':token}});
    var options=
    {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function(res){
            await axios.post('http://localhost:4000/updateTransactionStatus',{
                order_id: options.order_id,
                payment_id: res.razorpay_payment_id,
            },{headers:{'Authorization':token}})
            alert('You are a premium user now')
            document.getElementById('rzp-button1').style.visibility='hidden';
            document.getElementById('premium').innerHTML = 'You are premium user  ' ;
            localStorage.setItem('token',res.data.token);
            showLeaderboard();
        }
    };
    const rzp1=new Razorpay(options);
    rzp1.open();
    e.preventDefault();
    rzp1.on('payment.failed',async function(response){
        console.log(response);
        const answer= await axios.post("http://localhost:4000/updateFailedTransactionStatus",{
            order_id: options.order_id
        },{headers: {'Authorization' : token}})
        console.log(answer);
        alert('Something went wrong');
    });
}

