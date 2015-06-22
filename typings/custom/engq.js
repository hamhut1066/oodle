// The engineering quantity object.
/// <reference path="../typings/es6-promise/es6-promise.d.ts" />
/// <reference path="../typings/custom/ranges.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EngMath;
(function (EngMath) {
    function isNumber(n) {
        return !isNaN(n) && isFinite(n);
    }
    EngMath.isNumber = isNumber;
    function isFloat(n) {
        return isNumber(n);
    }
    EngMath.isFloat = isFloat;
    function isInteger(n) {
        return !isNaN(n) && isFinite(n) && n % 1 === 0;
    }
    EngMath.isInteger = isInteger;
})(EngMath = exports.EngMath || (exports.EngMath = {}));
var InterfaceEng = (function () {
    function InterfaceEng() {
    }
    InterfaceEng.prototype._expand = function (func, tree) {
        if (tree instanceof EngQ) {
            return [func(tree)];
        }
        var engDict = tree;
        var inner = [];
        for (var i in engDict) {
            inner = inner.concat(this._expand(func, engDict[i]));
        }
        return inner;
    };
    InterfaceEng.prototype._propogate = function (func, comp) {
        var outer = [];
        for (var _i = 0; _i < comp.length; _i++) {
            var i = comp[_i];
            var tmp = this._expand(func, i);
            outer = outer.concat(tmp);
        }
        return outer;
    };
    InterfaceEng.prototype.isValid = function () {
        return false;
    };
    InterfaceEng.prototype.dirty = function () {
        return true;
    };
    return InterfaceEng;
})();
exports.InterfaceEng = InterfaceEng;
var EngQ = (function (_super) {
    __extends(EngQ, _super);
    function EngQ(val, units, range, name) {
        _super.call(this);
        this._previousVal = undefined;
        this.val = val ? val : NaN;
        this.units = units ? units : "";
        this.name = name ? name : "";
        this.range = range ? range : {};
    }
    EngQ.prototype.isValid = function () {
        if (!this.val)
            return true;
        var result = [];
        try {
            result.push(EngMath.isNumber(this.val));
            if (this.range) {
                if (this.range.min) {
                    if (this.range.min.inclusive) {
                        result.push(this.val >= this.range.min.val);
                    }
                    else {
                        result.push(this.val > this.range.min.val);
                    }
                }
                if (this.range.max) {
                    if (this.range.max.inclusive) {
                        result.push(this.val <= this.range.max.val);
                    }
                    else {
                        result.push(this.val < this.range.max.val);
                    }
                }
            }
            return result.every(function (x) { return x; });
        }
        catch (_) {
            return false;
        }
    };
    EngQ.prototype.updateState = function () {
        this._previousVal = this.val;
    };
    EngQ.prototype.dirty = function () {
        if (!this._previousVal)
            return false;
        if (this._previousVal == this.val)
            return false;
        return true;
    };
    return EngQ;
})(InterfaceEng);
exports.EngQ = EngQ;
