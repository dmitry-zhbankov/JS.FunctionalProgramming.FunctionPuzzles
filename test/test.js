let assert = require("assert");
let funcLib = require("../func-puzzles");

describe("func-lib", function () {
    let sum = function (...args) {
        let res=0;
        for (let arg of args){
            res+=arg;
        }
        return res;
    };
    let sum2 = function (a,b,c) {
        return a+b+c;
    };

    describe("function partial()", function () {
        it("should return 9 when value is partial(sum,2)(3,4)", function () {
            assert.strictEqual(funcLib.partial(sum,2)(3,4), 9);
        });
        it("should return 11 when value is partial(sum,2)(4,5)", function () {
            assert.strictEqual(funcLib.partial(sum,2)(4,5), 11);
        });
        it("should return 9 when value is partial(sum,2,3)(4)", function () {
            assert.strictEqual(funcLib.partial(sum,2, 3)(4), 9);
        });
        it("should return 9 when value is partial(sum,2,3)(4)", function () {
            assert.strictEqual(funcLib.partial(sum,2, 3, 4)(5, 6 ,7), 27);
        });
    });
    describe("function partial()", function () {
        it("should return 9 when value is partial(sum,2)(3,4)", function () {
            assert.strictEqual(funcLib.curry(sum2)(2,3,4), 9);
        });
        it("should return 9 when value is curry(sum2)(2)(3)(4)", function () {
            assert.strictEqual(funcLib.curry(sum2)(2)(3)(4), 9);
        });
        it("should return 9 when value is curry(sum2)(2, 3)(4)", function () {
            assert.strictEqual(funcLib.curry(sum2)(2, 3)(4), 9);
        });
    });
});

