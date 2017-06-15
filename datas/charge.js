"use strict";
var config = require("./config");
var fs = require('fs');

//randomly generate charge
module.exports.loadCharge = function(cb){
    if (config.storeChargeFile && fs.existsSync(config.chargePath)) {
        fs.readFile(config.chargePath, function (err, data) {   
            if (err) throw err;   
                cb(JSON.parse(data)); 
        });
    }
    else{
        var result = [];
        
        var minH = new Date();
        minH.setHours(0, 0, 0, 0);
        minH = minH.getTime();

        var maxH = new Date();
        maxH.setHours(24, 0, 0, 0);
        maxH = maxH.getTime();

        for (var i = 0; i < config.nbTasks; i++){
            var debutTask = new Date(minH + (Math.floor(Math.random() * (maxH - minH))));
            var finTask = new Date(debutTask.getTime() + (Math.floor(Math.random() * (maxH - debutTask.getTime()))));
            if (finTask.getTime() - debutTask.getTime() > 7 * 3600 * 1000)
                finTask.setTime(debutTask.getTime() + 7 * 3600 * 1000);
            result.push({
                libelle: "tache " + i,
                deb: debutTask.getTime(),
                fin: finTask.getTime(),
                debLit: debutTask.format("H:i"),
                finLit: finTask.format("H:i")
            });
        }

        if (config.storeChargeFile){
            fs.writeFile(config.chargePath, JSON.stringify(result, null, 4), function(err) {
                if(err) {
                    return console.log(err);
                }

                cb(result);
            });
        }
        else
            cb(result);
    }
};




module.exports.roundCharge = function(){
    var arrondi = config.arrondi * 60 * 1000;

    for(let t of GLOBAL.charge){
        t.deb = t.deb - (t.deb % arrondi);
        t.fin = t.fin + (t.fin % arrondi > 0 ? arrondi - t.fin % arrondi : 0);
        t.debLit = (new Date(t.deb)).format("H:i");
        t.finLit = (new Date(t.fin)).format("H:i");
        t.timeSlotRequired = (t.fin - t.deb) / arrondi;
        var startDay = new Date(t.deb);
        startDay.setHours(0, 0, 0, 0);
        t.slotDeb = (t.deb - startDay.getTime()) / arrondi;
        t.slotFin = (t.fin - startDay.getTime()) / arrondi;
    }
}; 