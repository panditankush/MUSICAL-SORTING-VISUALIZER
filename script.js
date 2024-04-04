const n = 30;
var array = [];
var moves = [];

initialize();

let audioCtx = null;
function playNote(freq){
    if(audioCtx == null){
        audioCtx = new(
            AudioContext || 
            webkitAudioContext ||
            window.webkitAudioContext
        )();
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime+dur);
    
    // Lineaar interpolation to make the sound more ear-friendly
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(
        0,audioCtx.currentTime+dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function initialize(){
    for(let i = 0; i < n; i++){
        array[i] = Math.random();
    }
    showBars();
}

//``````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
// Selection Sort
function selectionSort(array){
    var n = array.length;
    for(let i = 0; i < n; i++){
        var mini = Number.MAX_SAFE_INTEGER, min_index = i;
        for(let j = i; j < n; j++){
            moves.push({indices: [min_index,j], type: "comp"});
            if(array[j] < mini){
                mini = array[j];
                min_index = j;
            }
        }
        moves.push({indices: [i,min_index], type: "swap"});
        [array[i],array[min_index]] = [array[min_index],array[i]];
    }
    return moves;
}
// Bubble Sort
function bubbleSort(array){
    var n = array.length;
    for(let i = 0; i < n; i++){
        for(let j = 1; j < n-i; j++){
            moves.push({indices: [j-1,j], type: "comp"});
            if(array[j-1] > array[j]){
                moves.push({indices: [j-1,j], type: "swap"});
                [array[j-1],array[j]] = [array[j],array[j-1]];
            }
        }
    }
    return moves;
}
// Insertion Sort
function insertionSort(array){
    var n = array.length;
    for(let i = 1; i < n; i++){
        var currEl = array[i];
        var j = i-1;
        for(; j >= 0; j--){
            moves.push({indices: [j+1,j], type: "comp"});
            if(array[j] > currEl){
                moves.push({indices: [j+1,j], type: "swap"});
                array[j+1] = array[j];
            }
            else break;
        }
        array[j+1] = currEl;
    }
    return moves;
}

//`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
function animate(){
    if(moves.length == 0){
        showBars();
        return;
    }
    const move = moves.shift(); // takes the first element of moves[]
    const [i,j] = move.indices;
    if(move.type == "swap"){
        [array[i],array[j]] = [array[j],array[i]];
    }
    playNote(200 + array[i]*500);
    playNote(200 + array[j]*500);
    showBars(move);
    setTimeout(function() {
        animate(moves);
    }, 0);
}
//``````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
function sort(){
    var algo = document.getElementById("algos");
    var sortBy = algo.options[algo.selectedIndex].value;
    console.log(sortBy + " is used");
    
    var temp = [...array]; // creates a copy of array
    // just temp = array will create a reference of array, not a copy

    disableRef();
    switch(sortBy){
        case "selectionSort":
            moves = selectionSort(temp);
            animate(moves);
            break;
        case "bubbleSort":
            moves = bubbleSort(temp);
            animate(moves);
            showBars(); 
            break;
        case "insertionSort":
            moves = insertionSort(temp);
            animate(moves);
            break;
    }
    console.log("Sorting end");
    enableRef();
}
//``````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````

function disableRef(){
    console.log("Disabling ref");
    document.getElementById("refBtn").disabled = true;
}

function enableRef(){
    console.log("Enabling ref");
    document.getElementById("refBtn").disabled = false;
}
function showBars(currMove){
    container.innerHTML = "";
    
    for(let i = 0; i < array.length; i++){
        const bar = document.createElement("div");
        const containerWidth = document.getElementById("container").offsetWidth;
        console.log("conatainerWidth");
        
        bar.style.height = array[i]*100 + "%"; 
        bar.style.width = (containerWidth / n) *100 + "%";
        bar.classList.add("bar"); 

        if(currMove && currMove.indices.includes(i)){
            if(currMove.type === "swap"){
                bar.classList.add("SwapCurrBar");
            }
            else{
                bar.classList.add("CompCurrBar");
            }
        }
        container.appendChild(bar);
    }
}
//``````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````