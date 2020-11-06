const getTrainMarkup = (trainEle, tunnel, tunnelCapacity) => {
    let trainMarkup = "";
    for (let i = 0; i < tunnelCapacity; i++) {
        if (tunnel[i] === undefined) {
            trainMarkup += `<div> </div>`
        }
        else {
            trainMarkup += `<div class="${tunnel[i] !== ' ' ? "train_bogey" : null}">${tunnel[i]}</div>`
        }
    }
    trainEle.innerHTML = trainMarkup;

}
const runTrain = (trainEle, tunnel, tunnelCapacity, count, trainData) => {
    if (count < tunnelCapacity || count === 0) {
        tunnel.unshift(trainData[count] ? trainData[count]["_id"] : " ");
        getTrainMarkup(trainEle, tunnel, tunnelCapacity)
        return count
    }
    else if (count < trainData.length) {
        tunnel.pop();
        tunnel.unshift(trainData[count] ? trainData[count]["_id"] : " ")
        getTrainMarkup(trainEle, tunnel, tunnelCapacity)
        return count
    }
    else {
        tunnel.pop();
        tunnel.unshift(" ")
        getTrainMarkup(trainEle, tunnel, tunnelCapacity)
        return count
    }
}

const getTrainData = (length) => {
    return new Promise((resolve, reject) => {
        let trainData = [];
        for (let i = 0; i < length; i++) {
            trainData.push({ _id: i + 1 })
        }
        resolve(trainData);
    })
}

const startTrain = (trainEle, trainData, tunnelCapacity) => {
    let count = 0;
    let tunnel = [];
    let interval = setInterval(() => {
        count = runTrain(trainEle, tunnel, tunnelCapacity, count, trainData)
        if (count < trainData.length + tunnelCapacity) {
            count++
        }
        else {
            count = 0
            tunnel = []
        }
    }, 1000);
    return interval;
}
document.addEventListener('DOMContentLoaded', () => {
    const trainEle = document.querySelector(".train");
    const startCTA = document.querySelector("#start");
    const stopCTA = document.querySelector("#stop");
    let interval = null;
    startCTA.addEventListener('click', async () => {
        clearInterval(interval)
        const tunnelCapacity = document.querySelector("#trainCapacity").value;
        const trainLength = document.querySelector("#trainLength").value;
        if (trainLength === "") {
            alert("Total bogeys is required");
            return;
        }
        if(tunnelCapacity === "") {
            alert("Tunnel capacity is required");
            return;
        }
        if(+trainLength < 0){
            alert("Total bogeys should be a positive number");
            return;
        }
        if (+tunnelCapacity < 0) {
            alert("Tunnel capacity should be a positive number");
            return;
        }
        const trainData = await getTrainData(+trainLength);
        interval = startTrain(trainEle, trainData, +tunnelCapacity)
    })
    stopCTA.addEventListener('click', async () => {
        clearInterval(interval);
        trainEle.innerHTML = ""
    })

})



