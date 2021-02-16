# Hashmask Stats

Hashmask Stats is a script that calculates recent Hashmask trade price stats. It is written in Node.js.

## Installation

Clone repository. Then:<br><br>
Run<br>`npm install web3`<br><br>&<br>`npm install dotenv`

## Usage

Create file named `.env` with a single line: `INFURA_URL="<your Infura URL>"`<br>where `<your Infura URL>` is set to your Infura (infura.io) mainnet url.<br><br>
Set `N` variable to the number of days you want to look back (set to 2 days by default).

Then:<br><br>
`node index.js`<br><br>
or<br>
`node daily.js`


## License

[MIT License]