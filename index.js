// Copyright (c) 2018-2019 The Genesis Network Developers
// Distributed under the MIT/X11 software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Enable reading from config
const config = require("config");
// Enable the duster manager module
const dusterManager = require("./dustermanager.js");

// -------------------------- Configuration --------------------------------------------------
// Load all the wallet configurations
let allConfigs = config.get("wallets");

// -------------------------- Run ------------------------------------------------------------
// Let's do this thing!
let dusterManager = new dusterManager.DusterManager();
dusterManager.doWork(allConfigs);
