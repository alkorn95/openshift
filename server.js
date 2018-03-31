const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const fs = require('fs');
const PORT = process.env.PORT || 8080

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json())
  .put('/map', (req, res) => {
    fs.writeFileSync(req.body.name+"",req.body.h + "\n" + req.body.m + "\n" + req.body.s + "\n" + req.body.lat + "\n" + req.body.lon + "\n" + req.body.bat);
    var s=req.body.name+"";
    res.json({msg:s});
})
  .get('/map/:name', (req,res)=>{
    if( fs.existsSync(req.params.name + "")){
    var text = fs.readFileSync(req.params.name + "", "utf8");
    var t = text.split("\n");
    res.json({ h: t[0], m: t[1], s: t[2], lat: t[3], lon: t[4], bat: t[5] });
    }
    else
    res.json({ h: "-1", m: "-1", s: "-1", lat: "-1", lon: "-1", bat: "-1" });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
