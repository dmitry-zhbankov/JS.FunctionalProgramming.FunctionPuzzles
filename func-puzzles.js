let funcLib = {};

funcLib = (function (context) {
    context.partial = function (g, ...args) {
        return g.bind(null, ...args);
    };

    context.curry = function (f) {
        return function currify(...args) {
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
        let res = [];
        for (let item of array) {
            res.push(callback(item));
        }
        return res;
    };

    context.filter = function (array, callback) {
        let res = [];
        for (let item of array) {
            if (callback(item)) {
                res.push(item);
            }
        }
        return res;
    };

    context.avgEvenNums = function (array) {
        let evens = context.filter(array, x => x % 2 === 0);
        let sum = context.linFold(evens, (accum, item, index, initialVal) => {
            return accum + item
        });
        return sum / evens.length;
    };

    context.lazy = function (f) {
        return function (...args) {
            return f.bind(null, ...args);
        }
    };

    context.memo = function (f) {
        let mem = {};
        return function () {
            let args = Array.prototype.slice.call(arguments);
            let objArgs=[];
            for (let arg of args){
                if (typeof arg === "object") {
                    arg=JSON.stringify(arg);
                }
                objArgs.push(arg);
            }
            if (objArgs in mem)
                return mem[objArgs];
            else {
                return mem[objArgs] = f.apply(this, args);
            }
        }
    };

    context.multiply = function (...args) {
        return context.linFold(args, (acum, item, index, initVal) => acum * item, 1);
    };

    context.Shape = function (name) {
        return new Shape(name);
    };

    context.Rectangle = function (width, height) {
        return new Rectangle(width, height);
    };

    context.Square = function (sideLength) {
        return new Square(sideLength)
    };

    context.ShapeStore = function () {
        return new ShapeStore();
    };

    class Shape {
        name;

        constructor(name) {
            this.name = name;
        }

        getPerimeter() {
            throw new Error("Not implemented");
        }

        getArea() {
            throw new Error("Not implemented");
        }
    }

    class Rectangle extends Shape {
        width;
        height;

        constructor(width, height) {
            super("Rectangle");
            this.width = width;
            this.height = height;
        }

        getArea() {
            return this.width * this.height;
        }

        getPerimeter() {
            return 2 * (this.width + this.height)
        }
    }

    class Square extends Shape {
        sideLength;

        constructor(sideLength) {
            super("Square");
            this.sideLength = sideLength;
        }

        getArea() {
            return this.sideLength * this.sideLength;
        }

        getPerimeter() {
            return this.sideLength * 4;
        }
    }

    class ShapeStore {
        shapes;

        constructor() {
            this.shapes = [];
        }

        getTotalRectPerimeter() {
            let res = 0;
            for (let shape of this.shapes) {
                if (shape instanceof Rectangle) {
                    res += shape.getPerimeter();
                }
            }
            return res;
        }

        getTotalSquareArea() {
            let res = 0;
            for (let shape of this.shapes) {
                if (shape instanceof Square) {
                    res += shape.getArea();
                }
            }
            return res;
        }
    }

    return context;
})(funcLib);

module.exports = funcLib;
