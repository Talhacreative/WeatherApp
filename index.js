const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync("home.html",'utf-8');

const replaceVal = (tempVal,orgVal)=>{
 let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
 temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
 temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
 temperature = temperature.replace("{%location%}",orgVal.name);
 temperature = temperature.replace("{%country%}",orgVal.sys.country);
 temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
 temperature = temperature.replace("{%humidity%}",orgVal.main.humidity);
 return temperature;
};

const server = http.createServer((req,res)=>{
  if(req.url=="/"){
    requests('https://api.openweathermap.org/data/2.5/weather?q=Lahore&appid=a44e13d93b890c9c61e7531ca42fe823')
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
server.listen(5000,"127.0.0.1");