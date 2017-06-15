"use strict";

require("./utils/date")();
var Algorithm = require("./algorithm");
var ga        = require("./ga");
var config    = require("./datas/config");

var deb = new Date();


require("./datas/charge").loadCharge(function(charge){
    GLOBAL.charge = charge;
    require("./datas/charge").roundCharge();
    require("./utils/fct").printCharge(GLOBAL.charge);

    var sequence = new Algorithm({
        replaceByGeneration: config.replaceByGeneration,
        bestSize: config.trackBest,
        getScore: ga.getScore,
        getRandomSolution: ga.generateInitialPopulation,
        popSize: config.nbInitialPopulation,
        evaluateSolution: ga.evaluateSolution,
        mutate: ga.mutate,
        crossover: ga.croisement,
        finaliser: ga.finaliser
    });

    sequence.run();
    GLOBAL.best = sequence.bests[0];
    require("./utils/fct").saveResult();

    var fin = new Date();
    console.log("done", Math.floor((fin.getTime() - deb.getTime()) / 1000));
   
    // sequence.on('run start', function () { 
    //     console.log('run start');
    // });
    // sequence.on('run finished', function (results) { 
    //     console.log('run finished - ', results); 
    //     console.log('run');
    // });
    // sequence.on('init start', function () { console.log('init start'); });
    // sequence.on('init end', function (pop) { console.log('init end', pop); });
    // sequence.on('loop start', function () { console.log('loop start'); });
    // sequence.on('loop end', function () { console.log('loop end'); });
    // sequence.on('iteration start', function (generation) { console.log('iteration start - ',generation); });
    // sequence.on('iteration end', function () { console.log('iteration end'); });
    // sequence.on('calcFitness start', function () { console.log('calcFitness start'); });
    // sequence.on('calcFitness end', function (pop) { console.log('calcFitness end', pop); });
    // sequence.on('parent selection start', function () { console.log('parent selection start'); });
    // sequence.on('parent selection end', function (parents) { console.log('parent selection end ',parents); });
    // sequence.on('reproduction start', function () { console.log('reproduction start'); });

    // sequence.on('find sum', function () { console.log('find sum'); });
    // sequence.on('find sum end', function (sum) { console.log('find sum end', sum); });

    // sequence.on('statistics', function (statistics) { console.log('statistics',statistics); });

    // sequence.on('normalize start', function () { console.log('normalize start'); });
    // sequence.on('normalize end', function (normalized) { console.log('normalize end',normalized); });
    // sequence.on('child forming start', function () { console.log('child forming start'); });
    // sequence.on('child forming end', function (children) { console.log('child forming end',children); });
    // sequence.on('child selection start', function () { console.log('child selection start'); });
    // sequence.on('child selection end', function (population) { console.log('child selection end',population); });

    // sequence.on('mutate', function () { console.log('MUTATION!'); });


    // sequence.on('reproduction end', function (children) { console.log('reproduction end',children); });
// 
    // GLOBAL.result = require("./ga").generateInitialPopulation();

    // require("./ga").evaluateSolution();

    // require("./utils/fct").printSolution(GLOBAL.result);
    // require("./utils/fct").saveResult();
    // var solution = {
    //     vacations: []
    // };

    // //Pour l'exemple on va prendre que des vac de 7h30 et on commence forécement a une demi heure ex: 7h, 7h30, 8h, 8h30
    // var arrondi = 30 * 60 * 1000; //(30 minutes en millisecondes)

    // for(let t of GLOBAL.charge){
    //     solution.vacations.push({
    //         libelle: t.libelle,
    //         deb: t.deb - (t.deb % arrondi),
    //         fin: t.fin + (t.fin % arrondi > 0 ? arrondi - t.fin % arrondi : 0)
    //     });
    // }
    // require("./utils/fct").printCharge(solution.vacations);
});

