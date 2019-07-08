const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const fs = require('fs');
const request = require('request');
const PORT = process.env.PORT || 8080
const ERad = 6372795;

function GetDist(l1, l2, ln1, ln2)
{

    var lat1 = l1 * Math.PI / 180.0;
    var lat2 = l2 * Math.PI / 180.0;
    var lon1 = ln1 * Math.PI / 180.0;
    var lon2 = ln2 * Math.PI / 180.0;
    var cl1 = Math.cos(lat1);
    var cl2 = Math.cos(lat2);
    var sl1 = Math.sin(lat1);
    var sl2 = Math.sin(lat2);
    var delta = lon2 - lon1;
    var cdelta = Math.cos(delta);
    var sdelta = Math.sin(delta);
    var y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
    var x = sl1 * sl2 + cl1 * cl2 * cdelta;
    var ad = Math.atan2(y, x);
    var dist = ad * ERad;
    return dist;

}


var URL = 'http://map.blitzortung.org/GEOjson/strikes_0.json';


express()
    .use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser.json())
    .put('/map', (req, res) => {
        if (fs.existsSync(req.body.name + "")) {
            var text = fs.readFileSync(req.body.name + "", "utf8");
            var t = text.split("\n");
            if (t[2] != req.body.lat || t[3] != req.body.lon)
                fs.writeFileSync(req.body.name + "", req.body.h + "\n" + req.body.m + "\n" + req.body.lat + "\n" + req.body.lon + "\n" + req.body.bat + "\n" + t[0] + "\n" + t[1] + "\n" + t[2] + "\n" + t[3]);
        }
        else {
            fs.writeFileSync(req.body.name + "", req.body.h + "\n" + req.body.m + "\n" + req.body.lat + "\n" + req.body.lon + "\n" + req.body.bat + "\n0\n0\n0\n0\n0\n0\n0");

        }
        var s = req.body.name + "";
        res.json({ msg: s });
    })
    .get('/map/:name', (req, res) => {
        if (fs.existsSync(req.params.name + "")) {
            var text = fs.readFileSync(req.params.name + "", "utf8");
            var t = text.split("\n");
            res.json({ h: t[0], m: t[1], lat: t[2], lon: t[3], bat: t[4], oh: t[5], om: t[6], olat: t[7], olon: t[8] });
        }
        else
            res.json({ h: "-1", m: "-1", lat: "-1", lon: "-1", bat: "-1", oh: "-1", om: "-1", olat: "-1", olon: "-1" });
    })
    .get('/lightnings/:name', (req, res) => {
        if (fs.existsSync(req.params.name + "")) {
            var text = fs.readFileSync(req.params.name + "", "utf8");
            var t = text.split("\n");
            request(URL, function (err, res1, body) {

                if (err) throw err;
                var strikes = body.split("],\n[")
                strikes[0] = strikes[0].slice(3, strikes[0].length)
                strikes[strikes.length - 1] = strikes[strikes.length - 1].substring(0, strikes[strikes.length - 1].length - 2)
                count = strikes.length
                var cnear = 0;
                var cmid = 0;
                var cfar = 0;
                var dist;
                nlat = Number(t[2]);
                nlon = Number(t[3]);
                for (var i = 0; i < count; i++) {
                    lon = Number(strikes[i].split(",")[0])
                    lat = Number(strikes[i].split(",")[1])
                    dist = GetDist(nlat, lat, nlon, lon)
                    if (dist < 10000)
                        cnear++
                    if (dist < 20000)
                        cmid++
                    if (dist < 500000)
                        cfar++
                }
                res.json({ near: cnear, mid: cmid, far: cfar });
            });
        }
        else
            res.json({ near: "-1", mid: "-1", far: "-1" });
    })
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

