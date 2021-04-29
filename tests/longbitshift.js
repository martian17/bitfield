var BitField = require("../main.js");

var bf = new BitField(100);

//bf.fill0();
//bf.int32[0] = 259;

bf.fill1();


console.log(bf.getBitList());

bf.bitshiftRightNbytes(0,1,5);

console.log(bf.getBitList());

bf.bitshiftLeftNbytes(0,1,5);

console.log(bf.getBitList());
