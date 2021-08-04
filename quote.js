const http = require('http');
const fs = require('fs');
var requests = require('requests');
const { BADHINTS } = require('dns');

const homeFile = fs.readFileSync("quote.html",'utf-8');

const replaceVal = (tempVal,orgVal)=>{
    let rnum =Math.floor( Math.random()*10);
 let temperature = tempVal.replace("{%quote%}",orgVal[rnum].text);
 temperature = temperature.replace("{%author%}",orgVal[rnum].author);

 return temperature;
 
};

const server = http.createServer((req,res)=>{
  if(req.url=="/"){
    requests('https://type.fit/api/quotes')
    .on('data',  (chunk)=> {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
     // console.log(arrdata[0].main.temp)
     const realTimeData = arrData.map(val=>replaceVal(homeFile,val)
       //  console.log(val.main);
     )
       .join("");
      // console.log(realTimeData);
      res.write(realTimeData);
    })
    .on('end', (err)=> {
      if (err) return console.log('connection closed due to errors', err);
     
      res.end();
    });
  }
});
server.listen(8000,"127.0.0.1");