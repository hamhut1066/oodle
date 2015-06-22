var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../typings/custom/engq.d.ts" />
var Calc = (function (_super) {
    __extends(Calc, _super);
    function Calc(_in, _do) {
        _super.call(this);
        _in ? this.children = this.init(_in) : this.children = undefined;
        this._do = _do ? _do : function () { };
        for (var i in this.children) {
            this[i] = this.children[i];
        }
    }
    Object.defineProperty(Calc.prototype, "val", {
        get: function () {
            if (this.value) {
                return this.value.val;
            }
        },
        set: function (value) {
            if (this.value) {
                this.value.val = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Calc.prototype.walk = function (func) {
        var result = [];
        for (var i in this.children) {
            result.push(func(this.children[i]));
        }
        return result;
    };
    Calc.prototype.updateState = function () {
        if (this.value) {
            this.value.updateState();
        }
        this.walk(function (node) {
            node.updateState();
        });
    };
    Calc.prototype.run = function () {
        if (this.isValid.call(this)) {
            var promise = new Promise(function (resolve, reject) {
                try {
                    var value = this._do.call(this, this);
                    resolve(value);
                }
                catch (e) {
                    reject(e);
                }
            }.bind(this));
            promise.then(function (object) {
                this.out = object;
                this.updateState();
                return object;
            }.bind(this))
                .catch(function (e) {
                console.error(e);
            });
        }
        else {
            console.log("The Calc is invalid");
        }
        return promise;
    };
    Calc.prototype.dirty = function () {
        var result = [];
        if (this.value) {
            result.push(this.value.dirty());
        }
        result = result.concat(this.walk(function (node) {
            return node.dirty();
        }));
        return result.some(function (x) { return x; });
    };
    Calc.prototype.isValid = function () {
        var result = [];
        if (this.value) {
            result.push(this.value.isValid());
        }
        result = result.concat(this.walk(function (node) {
            return node.isValid();
        }));
        return result.every(function (x) { return x; });
    };
    Calc.prototype.init = function (tree) {
        if (tree instanceof EngQ
            || tree instanceof Array) {
            this.value = tree;
            return undefined;
        }
        return this.build(tree);
    };
    Calc.prototype.build = function (tree, name) {
        var result = {};
        if (tree instanceof EngQ) {
            console.warn("Deprecated Funtionality, this shouldn't be running");
            return new Calc(tree, undefined);
        }
        var nodeDict = tree;
        for (var i in nodeDict) {
            result[i] = new Calc(nodeDict[i], undefined);
        }
        return result;
    };
    return Calc;
})(InterfaceEng);
exports.Calc = Calc;
