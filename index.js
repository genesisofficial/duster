const Duster = require("./duster.js");
let addy = "INSERT ADDRESS HERE";
let duster = new Duster.DustCollector(addy);
duster.doWork(addy, 300, 10000, 20, 0.001);