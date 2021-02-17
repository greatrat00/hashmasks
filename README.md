# Hashmask Stats

Hashmask Stats is a script that calculates recent Hashmask trade price stats. It is written in Node.js.

## Installation

Clone repository. Then,<br><br>
`npm install web3`<br>&<br>`npm install dotenv`

## Usage

Create file named `.env` with a single line: `INFURA_URL="<your Infura URL>"`<br>where `<your Infura URL>` is set to your Infura (infura.io) mainnet url.<br><br>
Set `N` variable in `index.js` to the number of days you want to look back (set to 1 day by default).

Next,<br><br>
`node index.js` for last 24 hours stats<br>
or<br>
`node daily.js` for daily stats since ~genesis of Hashmasks trading


## License

[MIT License]