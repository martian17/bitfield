var BitField = require("../main.js");

var bf = new BitField(100);

bf.fill1();

console.log(bf.getBitList());

//bf.bitshiftNbytes();

console.log(bf.getBitList());
