## Running Genesis Duster on Windows
*Shoutout to [Discord](https://discord.io/genesisnetwork) community members Cygnus and Coconuts for this!*
### Pre-Requisites
* [Genesis Full-Node Windows Wallet](https://genesisnetwork.io/wallets.php)
* [Genesis Duster](https://github.com/genesisofficial/duster/archive/master.zip)
* [Node.js for Windows](https://nodejs.org/en/download)

It's also a good idea to "Show hidden files, folders, and drives" and uncheck "Hide extension for known file types"
under `Control Panel > Appearance and Personalization > File Explorer Options`

### Wallet Configuration
#### First we need to edit the configuration file for your Genesis wallet.

This can be found easily by either:
* Clicking `Tools > Open Wallet Configuration File` in the Genesis Wallet
* Typing in the address bar `%appdata%` and hitting enter, then navigate to `Genesis` dir
* Navigating to the default directory at `C:\Users\Username\AppData\Roaming\Genesis\genesis.conf`

If `genesis.conf` does not exist in the directory, simply create a new text document and name it as such (minus the .txt)

#### Once the genesis.conf file is open input the following:
```
rpcuser=<RPCUSER>
rpcpassword=<RPCPASS>
rpcport=<NUMERIC_RPCPORT>
listen=1
server=1
```
You'll need to edit **RPCUSER**, **RPCPASS** and **NUMERIC_RPCPORT** with information of your choosing. 
The RPCPORT must be only numbers and less than 65535. An example would be `12345`

#### Save file and restart the Genesis wallet

### Duster Configuration
#### Unzip Duster folder and enter config folder

Inside config folder you will see a sample file called `default.json.sample`. Make a copy of this file then open with
notepad. Change the port, rpcuser and rpcpass to the **same values** you put in the `genesis.conf` file.

#### Now we need the address and private key of the address you're dusting

If you don't have this information saved, **you should do so and keep it offline**

But, if you don't, go to your Genesis wallet and perform the following:
* `File > Receiving Addresses` and copy the address.
* `Tools > Debug Console` type `dumpprivkey <address>` where address is the public address you just copied. This will dump the private key
** Example: `dumpprivkey S21ghSdfd32h2r02fiu2e345fgh45ywg`
* Copy the address and place in "address" field in the config file
* Copy the private key and place in the "private_keys" field in the config file

**Save file as `default.json`**

Example Duster Config:
![DustConf](https://i.imgur.com/FygnhaD.png)

### Run Duster
Finally, go to the duster folder that contains the `config` folder for the duster. Hold down `Shift + Right Click` on your mouse.
This **should** show either "Open Command Prompt Here" or "Open PowerShell Window Here". Selecting either one is fine. 
Alternatively, you can open command prompt by typing "cmd" into the Windows search bar.

#### Install & Update
Run the following in the Command Prompt or PowerShell window:

`npm update`
followed by
`npm install`

This should run for a bit and will display warnings

#### Dust!
Once everything has completed type `node index.js` in the cmd window. If everything is setup correctly, you will see "Total Inputs: ####"
followed by a transaction id. Let this run for a while. 

Ocassionally, you might have to run the `node index.js` file a few times to get the inputs where you want them.

If you have multiple addresses that you wish to dust, best bet is to copy and paste the duster folder a few times, name them the same
as the address you're trying to pull from, and have them setup with all the details. SecOps would warn against leaving this on your
PC as it does contain your private keys. Keeping these folder(s) offline until ready for use would be the smartest and **safest**
bet for your funds.
