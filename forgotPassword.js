
var email=document.getElementById('email'); 
document.addEventListener("submit",forgotPassword);
function forgotPassword(e) {
    e.preventDefault();
    const userDetails = {
         email:email.value
    }
    
    //console.log(userDetails);
    axios.post("http://localhost:4000/forgotPassword",userDetails)
    .then((response) => {
        if(response.status === 202){
            document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
        } else {
            throw new Error('Something went wrong!!!')
        }
    }).catch(err => {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })
}
