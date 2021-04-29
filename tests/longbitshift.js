var BitField = require("../main.js");

var bf = new BitField(100);

bf.fill0();
bf.int32[0] = 259;

console.log(bf.getBitList());

//bf.bitshiftNbytes(1,4,9);

console.log(bf.getBitList());
