"use strict";

var config = require("./datas/config");

module.exports.addToSolutionVac = function(solution, t){
     var cpt = 0;
    for (let v of solution.vacationList){
        if (v.debVac <= t.slotDeb && v.finVac >= t.slotFin){
            // for (let s = t.slotDeb; s < t.slotFin; s++)
            //     if (v.slots[s] == 1)
            //         return false;  
            require("./utils/fct").addTacheToVac(v, t);
            solution.chargeMap[t.libelle] = cpt;
            return true;
        }
        cpt++;
    }
    return false;
};


module.exports.addToSolutionNewVac = function(solution, t){
    var debutVac = {
        min: Math.max(t.slotFin - 15, 0),
        max: Math.min(t.slotDeb, 33),
    };
    debutVac = Math.round(debutVac.min + Math.random() * (debutVac.max - debutVac.min));
    var vacation = {
        debVac: debutVac,
        finVac: debutVac + 15,
        slots: require("./utils/fct").makeTimeSlots(),
        taches: {}
    };
    require("./utils/fct").addTacheToVac(vacation, t);
    solution.chargeMap[t.libelle] = solution.vacationList.length;
    solution.vacationList.push(vacation);
};

module.exports.generateInitialPopulation = function(){

    var maxVac = GLOBAL.charge.length;

    var solution = {
        fitness: null,
        vacationList: [],
        chargeMap: {}
    };

    for (let t of GLOBAL.charge){

        var addVac = Math.random() >= 0.5 ? true : false;
        var added = false;
        if (!addVac){
            added = module.exports.addToSolutionVac(solution, t);
        }

        if ((!added && !addVac) || addVac){
            //une vacation fait 7h30 il faut donc une vac qui commence entre la fin - 7h30 et le debut
            module.exports.addToSolutionNewVac(solution, t);
        }
    }

    return solution;

};

module.exports.finaliser = function(Algo){
    return Algo.generation >= 40 && Algo.bests[0].score > 1;
};

module.exports.evaluateSolution = function(solution){
    /*
        Pour juger une répartition on veut plusieurs paramètres
        Restrictif:
            Une tache doit etre sur une vac et ne pas chevaucher une autre
        Facultatif
            Le moins de vac possible
            Le moins d improductivité sur l'ensemble
            Le moins d'heures de nuit sur l'ensemble
    */

    var scoreOverlap = 0; // Min: 0 Max: Nombre de tache

    for (let t of GLOBAL.charge){
        var vacation = solution.vacationList[solution.chargeMap[t.libelle]];

        var upScore = true;

        for (let i = t.slotDeb; i <= t.slotFin; i++)
            if (vacation.slots[i] > 1){
                upScore = false;
                break;
            }           

        if (upScore)
            scoreOverlap++;
    }

    //On supprime les vacs vides de tache
    var newVacListe = [];
    for (let vac in solution.vacationList)
        if (Object.keys(solution.vacationList[vac].taches).length > 0){
            newVacListe.push(solution.vacationList[vac]);
            for (let t in solution.vacationList[vac].taches)
                solution.chargeMap[t] = newVacListe.length - 1;
        }

    solution.vacationList = newVacListe;

    //La nuit est de 21h a 6h du mat donc les slots 0-11 et 42-45
    var SlotsNuit = 0;
    var improductivity = 0;


    for (let vac of solution.vacationList){
        SlotsNuit += vac.debVac < 12 ? 12 - vac.debVac : 0;
        SlotsNuit += vac.finVac > 42 ? vac.finVac - 42 : 0;

        for (let i = vac.debVac; i < vac.finVac; i++)
            if (vac.slots[i] === 0)
                improductivity++;
    }

    var value, scoreVac, scoreNuit, scoreImproductivity = 0;
    if (scoreOverlap != GLOBAL.charge.length)
        value = scoreOverlap / GLOBAL.charge.length;
    else{
        scoreVac = (GLOBAL.charge.length - solution.vacationList.length) * 48;
        scoreNuit = (solution.vacationList.length * 16 - SlotsNuit) * 0.6;
        scoreImproductivity = (solution.vacationList.length * 46 - improductivity) * 0.05;
        value = scoreVac + scoreNuit + scoreImproductivity;
    }
    solution.fitness = {
        scoreOverlap: scoreOverlap, //Plus c'est haut mieux c'est
        nuits: SlotsNuit,
        improductivity: improductivity,
        nbVacs: solution.vacationList.length,
        value: value,
        detailsScore: value < 1 ? value : {v: scoreVac, imp: scoreImproductivity, n: scoreNuit} 
    };
    
    // if (!GLOBAL.best || GLOBAL.best.fitness.value < solution.fitness.value)
    //     GLOBAL.best = solution;
    // callback(solution.fitness.value);
};

module.exports.getScore = function(solution){
    return solution.fitness.value;
};

module.exports.mutate = function(solution, callback){

    if (Math.random() > config.mutationProbability){
        return solution;
    }

    for (var k = 0; k < config.nbMutation; k++){
        var task = GLOBAL.charge[Math.round(Math.random() * (GLOBAL.charge.length - 1))];

        //Supression de l'ancienne tache
        var vacation = solution.vacationList[solution.chargeMap[task.libelle]];
        if (!vacation)
            console.log("alerte undefined", solution);
        require("./utils/fct").removeTacheFromVac(vacation, task);

        var addVac = Math.random() >= 0.5 ? true : false;
        var added = false;
        if (!addVac)
            added = module.exports.addToSolutionVac(solution, task);
        
        if ((!added && !addVac) || addVac)
            module.exports.addToSolutionNewVac(solution, task);
    }
    
    
    return solution;
};


module.exports.croisement = function(s1, s2){

    if (Math.random() > config.croisementProbability)
        return JSON.parse(JSON.stringify(s1));

    var newSolution = {
        fitness: null,
        vacationList: [],
        chargeMap: {}
    };

    for (let t of GLOBAL.charge){
        if (!module.exports.addToSolutionVac(newSolution, t)){
            var source = Math.random() > 0.5 ? s1 : s2;
            
            var vac = source.vacationList[source.chargeMap[t.libelle]];
            var newVac = {
                debVac: vac.debVac,
                finVac: vac.finVac,
                slots: require("./utils/fct").makeTimeSlots(),
                taches: {}
            };
            require("./utils/fct").addTacheToVac(newVac, t);
            newSolution.chargeMap[t.libelle] = newSolution.vacationList.length;
            newSolution.vacationList.push(newVac);
        }
    }

    return newSolution;
};
