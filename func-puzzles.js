var funcLib = {};

arrLib = (function (context) {
    context.partial = function (g, ...args1) {
        return function (...args2) {
            return g(...args1, ...args2);
        }
    };

    context.curry = function (f) {
        return function currify() {
            const args = Array.prototype.slice.call(arguments);
            return args.length >= f.length ?
                f.apply(null, args) :
                currify.bind(null, ...args)
        }
    };

    context.linFold = function (array, callback, initialValue = 0) {
        let accum = initialValue;
        for (let i = 0; i < array.length; i++) {
            accum = callback(accum, array[i], i, initialValue);
        }
        return accum;
    };

    context.map = function (array, callback) {
        let res=[];
        for (let item of array){
            res.push(callback(item));
        }
        return res;
    };

    context.filter=function (array,callback) {
        let res=[];
        for (let item of array){
            if (callback(item)){
                res.push(item);
            }
        }
        return res;
    };

    context.avgEvenNums=function (array) {
        let evens=context.filter(array,x=>x%2===0);
        let sum=context.linFold(evens,(accum,item,index,initialVal)=>{return  accum+item});
        return sum/evens.length;
    };

    context.lazy=function(){

    };

    context.memo=function(f){
        let mem={};
        return function (n) {
            if (n in mem){
                return mem[n];
            }
            else {
                return mem[n]=f(n);
            }
        }
    };

    context.multiply=function(...args) {
        let res=1;
        for (let arg of args){
            res*=arg;
        }
        return res;
    };

    return context;

})(funcLib);

module.exports = funcLib;
