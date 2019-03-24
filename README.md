![GenX Logo](https://wiki.genesisnetwork.io/images/thumb/7/75/BrandBlueBlue.png/750px-BrandBlueBlue.png "Genesis")

## Genesis Duster &middot; [![Github License](https://img.shields.io/npm/l/express.svg)](https://github.com/genesisofficial/duster/LICENSE)

### Disclaimer
This is **beta** software and is not without issues. However, it works and works pretty good. The Genesis Official team take zero liability in loss funds for utilizing this script. Always always double check you're performing steps correctly. This is a semi-involved process which requires computer literacy. **DO NOT ATTEMPT TO USE IF YOU'RE UNSURE WHAT YOU'RE DOING**!

This software can be integrated to use on other digital currencies.

### What is This
A "duster" simply pulls your transactions together and creates them into fewer transactions of larger amounts in order to send to others more efficiently and effectively. If you've ever had an error stating "Too many UXTOs" "Transaction too large" etc., it's counting amount of transactions, not the amount of coins, that the wallet is having to put together to send to an address. This is a common issue with miners, masternode owners, etc. This script "automagically" sends those transactions back to yourself in larger chunks. Each time it performs its task, it is a transaction on the blockchain which **requires a fee**. This fee can be adjusted in the config. However, remember, the higher the fee, the quicker the transaction.

### Usage
#### Pre-Requisites
* Genesis v3 daemon installed on a Linux box or VM with wallet.dat attached to the address you want to collect dust from. This can come from your local QT wallet or CLI
* NPM Installed ```sudo apt-get install -y npm```
#### Steps
1) Clone or download this repo ```git clone https://github.com/genesisofficial/duster.git```
2) Extract the archive on a machine that has daemoninstalled
3) Open a new terminal and go to the duster folder - Example ```cd ~/duster```
4) Run the following in the terminal separately
```
npm update
npm install
```
5) Go to duster folder and edit the following
* index.js, add the address for which you are running the dust collector - retrieve from QT wallet or CLI
* in the file duster.js, line 112 insert the private key for the address - retrive from QT wallet or CLI
6) Go to directory where daemon is located (or if built and installed, just run from root dir) and start the daemon with something like the following, to match the configuration in the duster/config/default.json file
```
./genesisd -datadir=/path/to/.genesis/ -daemon=1 -rpcuser=rpcuser -rpcpassword=rpcpass -rpcport=56504 -rpcallowip=127.0.0.1 -server=1 -listen=1 -rpcworkqueue=1024
```
**Alternatively**: Create a genesis.conf file in the .genesis folder and run ```./genesisd``` or ```genesisd``` (if installed):
```
rpcuser=rpcuser
rpcpassword=rpcpass
rpcport=56504
rpcallowip=127.0.0.1
daemon=1
server=1
listen=1
rpcworkqueue=1024
```
* **Optional**: Run tail to view the logs of the daemon (in new terminal window)
```
tail -f /path/to/.genesis/main/debug.log &
```
Once daemon is fully synced, go back to the first terminal where you ran duster installation and run the following
```
node index.js
```
#### Note!
**You may have to run node index.js a few times before you get to a manageable input level. JS file will timeout occasionally, especially on single-core systems.**
