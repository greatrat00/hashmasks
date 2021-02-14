require('dotenv').config()
const hmABI = require('./hmABI.js');
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || process.env.INFURA_URL);

// Instantiate Hashmasks Token Contract
const hmTokenContract = new web3.eth.Contract(hmABI, '0xC2C747E0F7004F9E8817Db2ca4997657a7746928');

// Get block ~N days ago
const N = 2; // N days ago
const blocksBack = (N * 6422) | 0; // 6422 approx blocks per day

(async () => {
    await web3.eth.getBlockNumber().then(data => {
        let currentBlockHeight = data;
        let startBlock = currentBlockHeight - blocksBack;

        const init = async () => {
            await hmTokenContract.getPastEvents("Transfer", { fromBlock: startBlock }).then(async (events) => {
                const count = events.length;
                let event, transactionHash;
                let max = 0, min = 10e18, suma = 0, total = 0, championTokenId = 0;

                for (i = 0; i < count; i++) {
                    event = events[i];
                    const rv = event.returnValues;

                    transactionHash = events[i].transactionHash;
                    await web3.eth.getTransaction(transactionHash).then((result) => {
                        const value = parseFloat(web3.utils.fromWei(result.value, 'ether'));
                        if (value > 0) {
                            console.log(`${transactionHash}: Value paid for HM: ${value} ETH`);
                            if (value > max) {
                                max = value;
                                const rs = events[i].returnValues;
                                championTokenId = rs.tokenId;
                            }
                            if (value < min) min = value;

                            suma = suma + value;
                            total = total + 1;
                        }
                    }
                    );
                }

                const avg = suma / total;

                console.log('\n\nRESULTS:\n');
                console.log(`Min paid: ${min} ETH`);
                console.log(`Max paid: ${max} ETH`);
                console.log(`Avg paid: ${avg} ETH`);
                console.log(`Most expensive token: ${championTokenId}\n`);

            });

        };

        init();

    })
})()




