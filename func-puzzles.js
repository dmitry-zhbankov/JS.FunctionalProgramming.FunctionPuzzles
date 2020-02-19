var funcLib = {};

arrLib = (function (context) {
    context.partial=function (g,...args1) {
        return function (...args2) {
            return g(...args1,...args2);
        }
    };

    return context;

})(funcLib);

module.exports=funcLib;
