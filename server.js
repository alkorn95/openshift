const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const fs = require('fs');
const PORT = process.env.PORT || 8080

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json())
  .put('/map', (req, res) => {
    if( fs.existsSync(req.body.name + "")){
      var text = fs.readFileSync(req.body.name + "", "utf8");
      var t = text.split("\n");
      if(req.body.flag=="1")
      fs.writeFileSync(req.body.name+"",req.body.h + "\n" + req.body.m + "\n" + req.body.lat + "\n" + req.body.lon + "\n" + req.body.bat +"\n"+t[0]+"\n"+t[1]+"\n"+t[2]+"\n"+t[3]+"\n"+t[9]+"\n"+t[10]+"\n"+t[11]+"\n"+t[12]+ "\n" + req.body.flag);
      else
      fs.writeFileSync(req.body.name+"",t[0]+"\n"+t[1]+"\n"+t[2]+"\n"+t[3]+"\n"+ req.body.bat +"\n"+t[5]+"\n"+t[6]+"\n"+t[7]+"\n"+t[8]+"\n"+req.body.lat + "\n" + req.body.lon+"\n"+req.body.h + "\n" + req.body.m+ "\n" + req.body.flag);
      }
      else{
      fs.writeFileSync(req.body.name+"",req.body.h + "\n" + req.body.m + "\n" + req.body.lat + "\n" + req.body.lon + "\n" + req.body.bat +"\n0\n0\n0\n0\n0\n0\n0\n0\n0");
    
    }
    var s=req.body.name+"";
    res.json({msg:s});
})
  .get('/map/:name', (req,res)=>{
    if( fs.existsSync(req.params.name + "")){
    var text = fs.readFileSync(req.params.name + "", "utf8");
    var t = text.split("\n");
    res.json({ h: t[0], m: t[1], lat: t[2], lon: t[3], bat: t[4], oh: t[5], om: t[6], olat: t[7], olon: t[8], nwlat: t[9], nwlon: t[10], nwh: t[11], nwm: t[12], flag: t[13] });
    }
    else
    res.json({ h: "-1", m: "-1", lat: "-1", lon: "-1", bat: "-1", oh: "-1", om: "-1", olat: "-1", olon: "-1", nwlat: "-1", nwlon: "-1", nwh: "-1", nwm: "-1", flag: "0" });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
