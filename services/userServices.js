const getExpenses=(req,where)=>{
    return req.user.getExpenses({where});
}
const getDownloadedFiles=(req)=>{
    return req.user.getDownloadedFiles();
}
module.exports={
    getExpenses,
    getDownloadedFiles
}