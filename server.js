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
      fs.writeFileSync(req.body.name+"",req.body.h + "\n" + req.body.m +  "\n" + req.body.lat + "\n" + req.body.lon + "\n" + req.body.bat +"\n"+t[0]+"\n"+t[1]+"\n"+t[2]+"\n"+t[3]);
      }
      else{
      fs.writeFileSync(req.body.name+"",req.body.h + "\n" + req.body.m +  "\n" + req.body.lat + "\n" + req.body.lon + "\n" + req.body.bat +"\n0\n0\n0\n0\n0\n0\n0");
    
    }
    var s=req.body.name+"";
    res.json({msg:s});
})
  .get('/map/:name', (req,res)=>{
    if( fs.existsSync(req.params.name + "")){
    var text = fs.readFileSync(req.params.name + "", "utf8");
    var t = text.split("\n");
    res.json({ h: t[0], m: t[1],  lat: t[2], lon: t[3], bat: t[4], oh: t[5], om: t[6], olat: t[7], olon: t[8] });
    }
    else
    res.json({ h: "-1", m: "-1",  lat: "-1", lon: "-1", bat: "-1", oh: "-1", om: "-1", olat: "-1", olon: "-1" });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))