// Copyright (c) 2018-2019 The Genesis Network Developers
// Distributed under the MIT/X11 software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

"use strict";

// Import some functionality
const bitcoin = require("bitcoin");
let Regex = require("regex");

// Constructor to get things set up
function Duster(currentWalletConfig) {
  this.currentWalletConfig = currentWalletConfig;
  this.baseWallet = new bitcoin.Client(this.currentWalletConfig);
}

// -------------------------- Helpers --------------------------------------------------------

var sortByAmount = function(state) {
  return new Promise(function(resolve, reject) {
    // Custom compare by amount
    function compare(a, b) {
      if (a.amount < b.amount) return -1;
      if (a.amount > b.amount) return 1;
      return 0;
    }
    // sort the values from smallest to largest
    state.txList.sort(compare);

    if (state.txList) {
      resolve(state);
    } else {
      reject(Error("Unable to sort"));
    }
  });
};

var makeBatches = function(state) {
  return new Promise(function(resolve, reject) {
    state.inputBatches = [];
    state.inputBatches[0] = [];
    var elementCounter = 0;
    var batchTracker = 0;

    for (let index = 0; index < state.txList.length; index++) {
      const element = state.txList[index];

      if (
        element.address === state.sourceAddress &&
        element.amount < state.maximumInputAmount &&
        element.confirmations > state.minimumConfirmations
      ) {
        if (elementCounter == state.batchSize) {
          // Init the next batch
          elementCounter = 0;
          batchTracker++;
          state.inputBatches[batchTracker] = [];
        }
        // Add the element to this batch
        state.inputBatches[batchTracker].push(element);
        elementCounter++;
      }
    }

    if (state.inputBatches) {
      resolve(state);
    } else {
      reject(Error("Unable to create batches"));
    }
  });
};

var consolidateBatch = function(batchState) {
  return new Promise(function(resolve, reject) {
    batchState.items.forEach(inputTx => {
      batchState.batchValue += inputTx.amount;
      batchState.candidates.push({
        txid: inputTx.txid,
        vout: inputTx.vout
      });
      batchState.rawItems.push({
        txid: inputTx.txid,
        vout: inputTx.vout,
        scriptPubKey: inputTx.scriptPubKey,
        redeemScript: inputTx.redeemScript,
        amount: inputTx.amount
      });
    });
    let payoutAmount =
      Math.round((batchState.batchValue - batchState.batchTxFee) * 1000) / 1000;
    // console.log(payoutAmount + '/' + batchState.batchValue + '/' + batchState.batchTxFee);
    batchState.payment[batchState.sourceAddress] = payoutAmount;

    if (batchState) {
      resolve(batchState);
    } else {
      reject(Error("Unable to sort"));
    }
  });
};

var createBatchTransaction = function(batchState) {
  return new Promise(function(resolve, reject) {
    batchState.baseWallet.createRawTransaction(
      batchState.candidates,
      batchState.payment,
      0,
      function(err, rawtx) {
        if (err) {
          console.log(batchState.candidates);
          console.log(batchState.payment);
          reject(Error(err));
        } else {
          let rawSignPrivKeys = batchState.privateKeys;
          batchState.baseWallet.signRawTransaction(
            rawtx,
            batchState.rawItems,
            rawSignPrivKeys,
            function(signErr, rawSignResult) {
              if (signErr) {
                console.log(batchState.rawItems[0]);
                reject(Error(signErr));
              } else {
                //resolve(rawSignResult.complete);
                //resolve(rawSignResult.hex);
                batchState.baseWallet.sendRawTransaction(
                  rawSignResult.hex,
                  function(submitErr, submitResult) {
                    if (submitErr) {
                      reject(Error(submitErr));
                    } else {
                      resolve(submitResult);
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  });
};

// -------------------------- Exported Functions ---------------------------------------------
Duster.prototype.ProcessWalletRun = function(currentRunState) {
  return new Promise(function(resolve, reject) {
    // For now, only process the first wallet... untill I figure out concurrency
    var currentRun = currentRunState.runconfig;
    if (currentRun.active) {
      var runConfig = currentRun.config;
      // Dumb, but needed
      var that = this;
      that.baseWallet.listUnspent(runConfig.minimum_confirmations, function(err, unspent) {
        if (err) {
          reject(err);
        } else {
          console.log("Total Inputs: " + unspent.length);
          var state = {
            txList: unspent,
            batchSize: minimum_confirmations,
            sourceAddress: runConfig.address,
            privateKeys: runConfig.private_keys,
            maximumInputAmount: runConfig.maximum_input_amount,
            minimumConfirmations: runConfig.minimum_confirmations,
            batchTxFee: runConfig.batch_tx_fee
          };

          that.sortByAmount(state)
            .then(makeBatches)
            .then(function(batchedState) {
              var inputBatches = batchedState.inputBatches;
              inputBatches.forEach(batch => {
                var batchState = {
                  sourceAddress: batchedState.sourceAddress,
                  privateKeys: batchedState.privateKeys,
                  batchTxFee: batchedState.batchTxFee,
                  batchValue: 0,
                  candidates: [],
                  rawItems: [],
                  payment: {},
                  items: batch,
                  baseWallet: that.baseWallet
                };
                batchState.payment[sourceAddress] = 0;
                that.consolidateBatch(batchState)
                  .then(createBatchTransaction)
                  .then(function(results) {
                    resolve(results);
                  })
                  .catch(function(rejection) {
                    reject(rejection);
                  });
              });
            });
        }
      });
    } else {
      // Being inactive is not an error...
      resolve("Run configuration is inactive");
    }
  });
};

// -------------------------- Exports --------------------------------------------------------
exports.Duster = Duster;
