var BitField = function(n){
    var floats = Math.ceil(n/64)+1;//extra bits reserved for rng
    var buff = new ArrayBuffer(floats*8);
    var floatView = new Float64Array(buff);
    var int8View = new Uint8Array(buff);
    var intView = new Int32Array(buff);
    this.uint8 = int8View;
    this.int32 = intView;
    this.float64 = floatView;
    var that = this;
    
    var rule = [
        0,1,1,1,1,0,0,0
    ];
    
    this.setRandomBits = function(){
        for(var i = 0; i < (floats-1)*2; i++){//x2 because float is twice as long as int
            floatView[floats-1] = Math.random();
            int8View[(floats-1)*8] = int8View[(floats-1)*8+4];
            intView[i] = intView[(floats-1)*2];
        }
    };
    this.fill0 = function(){
        for(var i = 0; i < (floats-1)*2; i++){
            intView[i] = 0;
        }
    };
    this.fill1 = function(){
        for(var i = 0; i < (floats-1)*2; i++){
            intView[i] = -1;//2's complement
        }
    };
    this.get = function(idx){
        var i = idx>>5;//divide by 32
        var j = idx%32;
        return (intView[i]>>j)&1;
        //return Math.random()>0.5?0:1;
    };
    this.set = function(idx){
        var i = idx>>5;//divide by 32
        var j = idx%32;
        intView[i] |= (1<<j);
    };
    this.clear = function(idx){
        var i = idx>>5;//divide by 32
        var j = idx%32;
        intView[i] &= ~(1<<j);
    };
    this.invert = function(idx){
        var i = idx>>5;//divide by 32
        var j = idx%32;
        intView[i] ^= 1<<j;
    };
    this.getBitList = function(){
        var arr = [];
        for(var idx = 0; idx < n; idx++){
            var i = idx>>5;//divide by 32
            var j = idx%32;
            arr[idx] = (intView[i]>>j)&1;
        }
        return arr;
    };
    this.get2bits = function(idx){
        var i = idx>>3;//divide by 8
        var j = idx%8;
        var val = (int8View[i]|(int8View[i+1]<<8));
        return (val>>j)&3;//7 because 3 bits
    };
    this.stepCellAuto = function(){
        var first = that.get(0);
        var second = that.get(1);
        var secondLast = that.get(n-2);
        var last = that.get(n-1);
        var lastBit = first;//first bit
        for(var i = 1; i < n-1; i++){
            var thisbits = lastBit|(that.get2bits(i)<<1);
            lastBit = (thisbits>>1)&1;
            if(rule[thisbits]){
                that.set(i);
            }else{
                that.clear(i);
            }
        }
        
        //first bit
        if(rule[(last|(first<<1))|second<<2]){
            that.set(0);
        }else{
            that.clear(0);
        }
        //last bit
        if(rule[(secondLast|(last<<1))|first<<2]){
            that.set(n-1);
        }else{
            that.clear(n-1);
        }
    };
    
    //extension for sha256
    this.bitshiftRightNbytes = function(addr,n,k){//shift k bits
        var offset = k%8;
        var shifts = k>>>3;
        console.log(offset,shifts);
        for(var i = addr+n-1; i > addr+shifts; i--){//always one on the left
            var byte1 = int8View[i-shifts];//right byte
            var byte0 = int8View[i-shifts-1];//left byte
            int8View[i] = (byte0>>>(8-offset))|(byte1<<offset);//concatenating left and right byte partially
        }
        console.log(int8View[addr]);
        console.log(int8View[addr] >>> offset);
        int8View[addr+shifts] = (int8View[addr]<<offset);//left most useful byte
        //filling 0 on the left
        for(var i = addr+shifts-1; i >= addr; i--){
            int8View[i] = 0;
        }
    };
    
    this.bitshiftLeftNbytes = function(addr,n,k){//shift k bits
        var offset = k%8;
        var shifts = k>>>3;
        console.log(offset,shifts);
        for(var i = addr; i <　addr+n-1-shifts; i++){
            var byte1 = int8View[i+shifts];//left byte
            var byte2 = int8View[i+shifts+1];//right byte
            int8View[i] = (byte2<<(8-offset))|(byte1>>>offset);
        }
        console.log(int8View[addr]);
        console.log(int8View[addr] >>> offset);
        int8View[addr+n-1-shifts] = (int8View[addr+n-1]>>>offset);//right most useful byte
        //filling 0 on the left
        for(var i = addr+n-shifts; i < addr+n; i++){
            int8View[i] = 0;
        }
    };
    
    this.bitshift32left = function(addr,n){//at address addr, shifts n
        //uses the integer 32 view
        console.log(intView[addr]);
        intView[addr] = intView[addr] >>> n;
        console.log(intView[addr]);
    };
    
    this.bitshift32right = function(addr,n){//at address addr, shifts n
        //uses the integer 32 view
        console.log(intView[addr]);
        intView[addr] = intView[addr] << n;
        console.log(intView[addr]);
    };
};

module.exports = BitField;