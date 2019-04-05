// Copyright (c) 2018-2019 The Genesis Network Developers
// Distributed under the MIT/X11 software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

const Duster = require("./duster.js");
let addy = "INSERT ADDRESS HERE";
let duster = new Duster.DustCollector(addy);
duster.doWork(addy, 300, 10000, 20, 0.001);