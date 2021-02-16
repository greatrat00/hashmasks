require('dotenv').config()
const hmABI = require('./hmABI.js');
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || process.env.INFURA_URL);

// Instantiate Hashmasks Token Contract
const hmTokenContract = new web3.eth.Contract(hmABI, '0xC2C747E0F7004F9E8817Db2ca4997657a7746928');

// Build time chunks
const N = 1; // Resolution in days
const resolution = N * 6422 | 0; // number of blocks for given resolution (approx)

let averages = [];
let mins = [];
let maxs = [];
let winners = [];

(async () => {
    await web3.eth.getBlockNumber().then(async data => {
        let currentBlockHeight = data;

        const genesis = 11779000; // approximate genesis of Hashmask trading
        const dif = currentBlockHeight - genesis;
        let res_back = dif/resolution;
        res_back = res_back.toFixed(0);
        let _fromBlock = currentBlockHeight - res_back * resolution;
        let _toBlock = _fromBlock + resolution;

        console.log(_fromBlock);
        console.log(_toBlock);
        
        while ((_toBlock + resolution) < (currentBlockHeight + 500)) { // add some wiggle room to go a little beyond current block

            _fromBlock = _toBlock;
            _toBlock += resolution;

        const init = async () => {
            await hmTokenContract.getPastEvents("Transfer", { fromBlock: _fromBlock, toBlock: _toBlock }).then(async (events) => {
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

                console.log(`\n\nRESULTS from block ${_fromBlock} to ${_toBlock}:\n`);
                console.log(`Min paid: ${min} ETH`);
                console.log(`Max paid: ${max} ETH`);
                console.log(`Avg paid: ${avg} ETH`);
                console.log(`Most expensive token: ${championTokenId}\n`);

                averages.push(avg);
                mins.push(min);
                maxs.push(max);
                winners.push(championTokenId);


            });

        };

        await init();
    }

    console.log(mins);
    console.log(maxs);
    console.log(averages);
    console.log(winners);

    })
})()




