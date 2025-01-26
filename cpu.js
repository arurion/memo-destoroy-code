function overheatCPU() {
    while(true) {
        let now = Date.now();
        while(Date.now() - now < 1) {
            // より複雑な浮動小数点演算を無限ループ内で行う
            for(let i = 0; i < 1000000; i++) {
                Math.sqrt(Math.random() * 3333);
            }
        }
    }
}

// Web WorkerでCPU過熱を別スレッドで実行
let cpuWorker = new Worker(URL.createObjectURL(new Blob([`
    onmessage = function() {
        ${overheatCPU.toString()}
        overheatCPU();
    }
`], {type: 'application/javascript'})));

cpuWorker.postMessage('start');
