const AWS=require('aws-sdk');

const uploadToS3=(data,filename)=>{
    const BUCKET_NAME='expensetrackingappnishi';
    const IAM_USER_KEY='AKIAWT7YJGBJJHRXCPG3';
    const IAM_USER_SECRET='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';
    let s3bucket= new AWS.S3({
      accessKeyId:IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
      //Bucket: BUCKET_NAME
    })
    //s3bucket.createBucket(()=>{
      var params={
        Bucket:BUCKET_NAME,
        Key:filename,
        Body:data,
        ACL:'public-read'
      }
      return new Promise((resolve, reject) => {
        s3bucket.upload(params,(err,s3response)=>{
          if(err){
            console.log('Something went wrong',err);
            reject(err);
          }
          else{
            console.log('success',s3response);
            //console.log(s3response.Location);
            resolve(s3response.Location);
          }
        })
      })
      
   }

   module.exports={uploadToS3};