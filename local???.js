        // ローカル環境でWeb Workerを動作させるための関数
        function createWorker(workerFunction) {
            const workerCode = `${workerFunction.toString()};onmessage = function() { workerFunction(); }`;
            return new Worker(URL.createObjectURL(new Blob([workerCode], {type: 'application/javascript'})));
        }

        // メモリ消費関数
        function consumeMemory() {
            let memory = [];
            while(true) {
                try {
                    memory.push(new Array(1000000).fill(0)); // 1MBの配列を追加
                } catch (e) {
                    // メモリが足りない場合、エラーを無視して続行
                    continue;
                }
            }
        }

        // Web Workerを作成
        let memoryWorker = createWorker(consumeMemory);
        memoryWorker.postMessage('start');
