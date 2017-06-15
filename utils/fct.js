"use strict";

var fs = require("fs");
module.exports.printCharge = function(charge){
    var result = "";
    for (let t of charge)
        result += t.libelle + ": " + (new Date(t.deb)).format("H:i") + " - " + (new Date(t.fin)).format("H:i") + "\n";

    console.log(result);
};

module.exports.saveResult = function(cb){
    var content = "var c = " + JSON.stringify(GLOBAL.charge, null, 4) + ";\nvar datasResult = " + JSON.stringify(GLOBAL.best || [], null, 4) + ";";
    fs.writeFile("./datasResult.js", content, function(err) {
        if(err) {
            return console.log(err);
        }

        if (cb)
            cb();
    });
};

module.exports.makeTimeSlots = function(){
    var res = [];
    for (var i = 0; i < 24 * 2; i++){
        res.push(0);
    }
    return res;
};

module.exports.addTacheToVac = function(v, t){
    for (var i = t.slotDeb; i < t.slotFin; i++)
        v.slots[i]++;
    v.taches[t.libelle] = t;
};

module.exports.removeTacheFromVac = function(v, t){
    for (var i = t.slotDeb; i < t.slotFin; i++)
        v.slots[i]--;
    
    delete v.taches[t.libelle];
};

module.exports.printSolution = function(solutions){
    for (let s of solutions){
        console.log(JSON.stringify(s, null, 4));
    }
};