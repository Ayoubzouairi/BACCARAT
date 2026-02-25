
let results = [];

function addResult(res) {
    results.push(res);
    if(results.length > 5) results.shift();
    document.getElementById("history").innerText = results.join(" - ");
    analyze();
}

function analyze() {
    if(results.length < 5){
        document.getElementById("prediction").innerText = "Need 5 results...";
        return;
    }

    let weights = [1,1,1,2,3];
    let playerScore = 0;
    let bankerScore = 0;

    for(let i=0;i<5;i++){
        if(results[i] === 'P') playerScore += weights[i];
        if(results[i] === 'B') bankerScore += weights[i];
    }

    let total = playerScore + bankerScore;
    if(total === 0) return;

    let playerProb = (playerScore/total)*100;
    let bankerProb = (bankerScore/total)*100;

    let diff = Math.abs(playerProb - bankerProb);

    if(diff < 8){
        document.getElementById("prediction").innerText = "No Clear Entry (Skip)";
        document.getElementById("confidence").innerText = "Low Confidence";
        return;
    }

    if(playerProb > bankerProb){
        document.getElementById("prediction").innerText = "Bet: PLAYER (" + playerProb.toFixed(1) + "%)";
    } else {
        document.getElementById("prediction").innerText = "Bet: BANKER (" + bankerProb.toFixed(1) + "%)";
    }

    document.getElementById("confidence").innerText = "Confidence: " + diff.toFixed(1) + "%";
}

function resetGame(){
    results = [];
    document.getElementById("history").innerText = "";
    document.getElementById("prediction").innerText = "Waiting for data...";
    document.getElementById("confidence").innerText = "";
}
