/*
  @typescript_class SimpleClass
  @typescript_constructor 
    a: string \ 
    b: bool \ 
    opts?: Options
  @typescript_interface Options
    auto_reconnect?: bool \
    poolSize?: number
  @ignore 
*/
var SimpleClass = function SimpleClass(a, b, options) {  
}

/*
  @typescript_method run \
    param: bool \
    callback: (err, result) => void
*/
SimpleClass.prototype.run = function run(param, callback) {  
}

/*
  @typescript_class SimpleClass2
  @typescript_constructor 
    a: string \ 
    b: bool \ 
    opts?: Options2
  @typescript_interface Options2
    auto_reconnect?: bool \
    poolSize?: number
  @ignore 
*/
var SimpleClass2 = function SimpleClass2(a, b, options) {  
}

/*
  @typescript_method run void
    param: bool \
    callback: (err, result) => void
*/
SimpleClass2.prototype.run2 = function run2(param, callback) {  
}

exports.SimpleClass = SimpleClass;
exports.SimpleClass2 = SimpleClass2;