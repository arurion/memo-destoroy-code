function consumeMemory() {
    let memory = [];
    let counter = 0;
    function cycle() {
        try {
            memory.push(new Array(1000000).fill(0)); // 1MBの配列を追加
            counter++;
            if (counter % 100 === 0) {
                // 一定の間隔でメモリを解放しつつ、新しいメモリを消費
                memory = [memory[memory.length - 1]];
            }
        } catch (e) {
            // メモリ不足でエラーが出ても、一時的に解放して再試行
            memory = [];
            counter = 0;
        }
        setTimeout(cycle, 0); // 再帰的に呼び出すことで、ブラウザの停止を回避しようとする
    }
    cycle();
}

// Web Workerでメモリ消費を別スレッドで実行
let memoryWorker = new Worker(URL.createObjectURL(new Blob([`
    onmessage = function() {
        ${consumeMemory.toString()}
        consumeMemory();
    }
`], {type: 'application/javascript'})));
memoryWorker.postMessage('start');
