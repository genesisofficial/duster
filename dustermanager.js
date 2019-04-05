// Copyright (c) 2018-2019 The Genesis Network Developers
// Distributed under the MIT/X11 software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

"use strict";

// Make the actual duster module available
const dusterModule = require("./duster.js");

// -------------------------- Helpers --------------------------------------------------------
// Process the list of wallets
var processWalletList = function(walletList) {
  return new Promise(function(resolve, reject) {
    // For now, only process the first wallet... untill I figure out concurrency
    processWallet(walletList[0])
      .then(function(result) {
        resolve(result);
      })
      .catch(function(rejection) {
        reject(rejection);
      });
  });
};

// Process an individual wallet
var processWallet = function(currentWallet) {
  return new Promise(function(resolve, reject) {
    if (currentWallet.active) {
      // Configure duster to use the configured wallet for the run
      let duster = new dusterModule.Duster(currentWallet.config);
      // For now, only process the first wallet run... untill I have time to figure out concurrency
      // Create a state object to make it easier to manage whilst passing stuff around
      var state = {
        runconfig: currentWallet.runconfigs[0]
      };
      duster
        .ProcessWalletRun(state)
        .then(function(result) {
          resolve(result);
        })
        .catch(function(rejection) {
          reject(rejection);
        });
    } else {
      // Being inactive is not an error...
      resolve("Wallet is inactive");
    }
  });
};

// -------------------------- Run ------------------------------------------------------------
// Init
function DusterManager() {}

// Let's do this thing!
DusterManager.prototype.doWork = function(allConfigs) {
  processWalletList(allConfigs)
    .then(function(result) {
      console.log(result);
    })
    .catch(function(rejection) {
      console.error(Error(rejection));
    });
};

// -------------------------- Exports --------------------------------------------------------
exports.DusterManager = DusterManager;
