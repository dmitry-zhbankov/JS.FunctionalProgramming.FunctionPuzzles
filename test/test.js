let assert = require("assert");
let funcLib = require("../func-puzzles");
const {performance} = require("perf_hooks");

describe("func-lib", function () {
    let sum = function (...args) {
        let res = 0;
        for (let arg of args) {
            res += arg;
        }
        return res;
    };

    let sum2 = function (a, b, c) {
        return a + b + c;
    };

    let sumN = function (n) {
        let sum = 0;
        for (let i = 0; i < n; i++) {
            sum += i;
        }
        return sum;
    };

    let objSum = function (...args) {
        let res = 0;
        for (let arg of args) {
            res += arg.value;
        }
        return res;
    };

    describe("function partial()", function () {
        it("should return 9 when value is partial(sum,2)(3,4)", function () {
            assert.strictEqual(funcLib.partial(sum, 2)(3, 4), 9);
        });
        it("should return 11 when value is partial(sum,2)(4,5)", function () {
            assert.strictEqual(funcLib.partial(sum, 2)(4, 5), 11);
        });
        it("should return 9 when value is partial(sum,2,3)(4)", function () {
            assert.strictEqual(funcLib.partial(sum, 2, 3)(4), 9);
        });
        it("should return 9 when value is partial(sum,2,3)(4)", function () {
            assert.strictEqual(funcLib.partial(sum, 2, 3, 4)(5, 6, 7), 27);
        });
    });
    describe("function curry()", function () {
        it("should return 9 when value is funcLib.curry(sum2)(2, 3, 4)", function () {
            assert.strictEqual(funcLib.curry(sum2)(2, 3, 4), 9);
        });
        it("should return 9 when value is curry(sum2)(2)(3)(4)", function () {
            assert.strictEqual(funcLib.curry(sum2)(2)(3)(4), 9);
        });
        it("should return 9 when value is curry(sum2)(2, 3)(4)", function () {
            assert.strictEqual(funcLib.curry(sum2)(2, 3)(4), 9);
        });
    });
    describe("function linFold()", function () {
        it("should return 15 when value is linFold([1,2,3,4,5]," +
            "(accum,item,index,initial)=>{return accum+item;})", function () {
            assert.strictEqual(funcLib.linFold([1, 2, 3, 4, 5],
                (accum, item, index, initial) => {
                    return accum + item;
                }), 15);
        });
        it("should return 16 when value is linFold([1,2,3,4,5]," +
            "(accum,item,index,initial)=>{return accum+item;},1)", function () {
            assert.strictEqual(funcLib.linFold([1, 2, 3, 4, 5],
                (accum, item, index, initial) => {
                    return accum + item;
                }, 1), 16);
        });
    });
    describe("function map()", function () {
        it("should return [1, 4, 9, 16, 25] when value is map([1, 2, 3, 4, 5], x => x * x)", function () {
            assert.deepStrictEqual(funcLib.map([1, 2, 3, 4, 5], x => x * x), [1, 4, 9, 16, 25]);
        });
    });
    describe("function filter()", function () {
        it("should return [2, 4] when value is filter([1, 2, 3, 4, 5], x => x % 2 === 0)", function () {
            assert.deepStrictEqual(funcLib.filter([1, 2, 3, 4, 5], x => x % 2 === 0), [2, 4]);
        });
    });
    describe("function avgEvenNums()", function () {
        it("should return [2, 4] when value is funcLib.avgEvenNums([1, 2, 3, 4, 5])", function () {
            assert.deepStrictEqual(funcLib.avgEvenNums([1, 23, 2, 6, 12, 0]), 5);
        });
    });
    describe("function avgEvenNums()", function () {
        it("should return 120 when value is funcLib.multiply(1, 2, 3, 4, 5)", function () {
            assert.strictEqual(funcLib.multiply(1, 2, 3, 4, 5), 120);
        });
    });
    describe("Rectangle class", function () {
        it("should return 6 when value is new new funcLib.Rectangle(2,3).getArea()", function () {
            assert.strictEqual(funcLib.Rectangle(2, 3).getArea(), 6);
        });
        it("should return 10 when value is new new funcLib.Rectangle(2,3).getPerimeter()", function () {
            assert.strictEqual(funcLib.Rectangle(2, 3).getPerimeter(), 10);
        });
    });
    describe("Rectangle class", function () {
        it("should return 9 when value is new funcLib.Square(3).getArea()", function () {
            assert.strictEqual(funcLib.Square(3).getArea(), 9);
        });
        it("should return 12 when value is new funcLib.Square(3).getPerimeter()", function () {
            assert.strictEqual(funcLib.Square(3).getPerimeter(), 12);
        });
    });
    describe("ShapeStore class", function () {
        let rect1 = funcLib.Rectangle(2, 3);
        let rect2 = funcLib.Rectangle(3, 4);
        let sq = funcLib.Square(3);
        let shapeStore = funcLib.ShapeStore();
        shapeStore.shapes.push(rect1, rect2, sq);

        describe("items are Rectangle(2,3), Rectangle(3,4), Square(3)", function () {
            it("should return 24 when value is shapeStore.getTotalRectPerimeter()", function () {
                assert.strictEqual(shapeStore.getTotalRectPerimeter(), 24);
            });
            it("should return 9 when value is shapeStore.getTotalSquareArea()", function () {
                assert.strictEqual(shapeStore.getTotalSquareArea(), 9);
            });
        });
    });
    describe("function memo()", function () {
        let checkMemo = function (func, expectedRes, ...args) {
            let memoFunc = funcLib.memo(func);

            let t1, t2;
            let dt1, dt2;
            let res;

            t1 = performance.now();
            res = memoFunc(...args);
            t2 = performance.now();
            dt1 = t2 - t1;

            it("should return expectedRes", function () {
                assert.equal(res, expectedRes);
            });

            t1 = performance.now();
            res = memoFunc(...args);
            t2 = performance.now();
            dt2 = t2 - t1;

            it("t1 should be more than t2", function () {
                assert.equal(dt1 > dt2, true);
            });
        };
        describe('single argument memo', function () {
            describe('sumN memo', function () {
                let n = 1e7;
                describe('should return (n - 1) / 2 * n when n is 1e7', function () {
                    checkMemo(sumN, (n - 1) / 2 * n, n);
                });

                n = 1e8;
                describe('should return (n - 1) / 2 * n when n is 1e8', function () {
                    checkMemo(sumN, (n - 1) / 2 * n, n);
                });
            });
        });
        describe("multiple arguments memo", function () {
            describe('sum memo', function () {
                describe('should return 6 when values are 1,2,3', function () {
                    checkMemo(sum, 6, 1, 2, 3);
                });
                describe('should return 10 when values are 1,2,3,4', function () {
                    checkMemo(sum, 10, 1, 2, 3, 4);
                });
            });
        });
        describe("object memo", function () {
            describe('objSum memo', function () {
                describe('should return 6 when values are 1,2,3', function () {
                    checkMemo(objSum, 6, {value: 1}, {value: 2}, {value: 3});
                });
                describe('should return 10 when values are 1,2,3,4', function () {
                    checkMemo(objSum, 10, {value: 1}, {value: 2}, {value: 3}, {value: 4});
                });
            });
        });
    });
    describe("function lazy()", function () {
        it("should return 9 when value is funcLib.lazy(sum)(2,3,4)()", function () {
            assert.deepStrictEqual(funcLib.lazy(sum)(2, 3, 4)(), 9);
        });
    });
});
