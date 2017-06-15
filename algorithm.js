"use strict";

var Algorithm = function(opt){
    this.generation = 0;

    this.replaceByGeneration = opt.replaceByGeneration || 8;
    this.bestSize = opt.bestSize;
    this.popSize = opt.popSize;
    this.finaliser = opt.finaliser;
    this.getScore = opt.getScore;
    this.getRandomSolution = opt.getRandomSolution;
    this.evaluateSolution = opt.evaluateSolution;
    this.mutate = opt.mutate;
    this.crossover = opt.crossover;

    this.init();
};

Algorithm.prototype.run = function(){
    console.log("initial best", this.bests[0]);
    while(!this.finaliser(this))
        this.runIteration();
};

Algorithm.prototype.runIteration = function(){
    this.generation++;
    var bestScore = this.bests[0].score;

    var newGen = [];
    //On crée un certain nombre de nouvelles solution via croisement et mutation
    for (let i = 0; i < this.replaceByGeneration; i++){
        let S1 = this.population[Math.round(Math.random() * (this.popSize - 1))];
        let S2 = this.population[Math.round(Math.random() * (this.popSize - 1))];

        newGen[i] = this.crossover(S1, S2);
        newGen[i] = this.mutate(newGen[i]);
    }



    for (let i = 0; i < this.replaceByGeneration; i++){
        
        /* 
            On sélectionne une solution au hasard dans la population
            mais on s'assure qu'elle ne fait pas partie des meilleurs
        */
        var ch = null;
        do{
            ch = Math.round(Math.random() * (this.popSize - 1));
        } while(this.isInBest(ch));

        this.population[ch] = newGen[i];
        this.evaluateSolution(this.population[ch]);
        this.addToBest(this.population[ch], ch);
    }

    var average = 0;
    for (let i = 0; i < this.population.length; i++)
        average += this.getScore(this.population[i]);
    console.log("avg", average / this.population.length);

    if (bestScore != this.bests[0].score)
        console.log("New world record", this.bests[0].solution.fitness, this.bests[0].index);

};


Algorithm.prototype.isInBest = function(solutionIndex){
    for (var i in this.bests)
        if (this.bests[i].index == solutionIndex)
            return true;
    
    return false;
};

Algorithm.prototype.addToBest = function(solution, index){
    var score = this.getScore(solution);
    if (this.bests.length < this.bestSize){
        this.bests.push({solution: solution, index: index, score: score});
        return this.sortBest();
    }
    
    if (this.bests[this.bestSize - 1].score < score){
        this.bests[this.bestSize  - 1] = {solution: solution, index: index, score: score};
        return this.sortBest();
    }
};

Algorithm.prototype.init = function(){
    this.population = [];
    this.bests = [];
    for (var i = 0; i < this.popSize; i++){
        var solution = this.getRandomSolution();
        this.evaluateSolution(solution);
        this.population.push(solution);
        this.addToBest(solution, i);
    }
};

Algorithm.prototype.sortBest = function(){
    this.bests.sort(function(a, b){
        if (a.score < b.score)
            return 1;
        if (a.score > b.score)
            return -1;
        return 0;
    });
};

module.exports = Algorithm;