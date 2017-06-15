$(document).ready(function(){
    var charge = "<ul>";
    for (let i in c){
        charge += "<li>" + c[i].libelle + " (" + c[i].debLit + " - " + c[i].finLit + ")</li>";
    }
    charge += "</ul>";

    $("#charge").html(charge);
    var rules = "";
    for (let i = 0; i < 48; i++){
        rules += "<span>" + (i % 2 === 0 ? i / 2 : "") + "</span>";
    }

    $("#rle").html(rules);
    var vacs = "<ul>";
    for(let i in datasResult.solution.vacationList){
        vacs += "<li style='left:" + (datasResult.solution.vacationList[i].debVac / 48) * 100 + "%;width:31.25%;'>";
            for (var t in datasResult.solution.vacationList[i].taches){
                var pos = datasResult.solution.vacationList[i].taches[t].slotDeb - datasResult.solution.vacationList[i].debVac;
                var w = datasResult.solution.vacationList[i].taches[t].slotFin - datasResult.solution.vacationList[i].taches[t].slotDeb;
                vacs += "<span class='tache' style='left:" + (pos / 15) * 100 + "%;width:" + (w / 16) * 100 + "%'>" + t + " " + datasResult.solution.vacationList[i].taches[t].debLit + " - " + datasResult.solution.vacationList[i].taches[t].finLit + "</span>";
            }
        vacs += "</li>";
    }
    vacs += "</ul>";
    $("#vac").html(vacs);
});