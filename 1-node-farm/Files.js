const fs=require('fs'); //file system module (read/write files)
// blocking synchronous way
const txt =fs.readFileSync("txt/input.txt","utf-8"); //read file synchronously
console.log(txt);

// non-blocking asynchronous way
fs.readFile("txt/start.txt","utf-8",(err,data1)=>{
    fs.readFile(`txt/${data1}.txt`,"utf-8",(err,data2)=>{
        if(err) return console.log("ERROR! 😢")
        console.log(data2);
        fs.readFile("txt/append.txt","utf-8",(err,data3)=>{
            console.log(data3);
            fs.writeFile("txt/final.txt",`${data2}\n${data3}`,"utf-8",err=>{
                console.log("Your file has been written 🤗");
            }); //write file asynchronously (non-blocking)

        }); //read file asynchronously (non-blocking) 

    }); //read file asynchronously (non-blocking) 
}); //read file asynchronously (non-blocking) 
console.log("Reading file..."); //this will be printed first