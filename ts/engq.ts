// The engineering quantity object.
/// <reference path="../typings/es6-promise/es6-promise.d.ts" />
/// <reference path="../typings/custom/ranges.d.ts" />

export interface EngQDict {
    // NOTE: This defines recursion! this can potentially go wrong!! BE WARNED!!
    [key: string]: EngQ | EngQDict

    // The following keys are here to fix errors on type flow
}

export module EngMath {
    export function isNumber(n: number) {
        return !isNaN(n) && isFinite(n);
    }

    export function isFloat(n: number) {
        return isNumber(n);
    }

    export function isInteger(n: number) {
        return !isNaN(n) && isFinite(n) && n%1===0;
    }
}

export class InterfaceEng {
    /* Propogates this function through all input and output Quantities */
    private _expand<T> (func: (value: EngQ) => T , tree: EngQ | EngQDict): Array<T> {

        if (tree instanceof EngQ) {
            return [func(tree)]
        }

        var engDict = <EngQDict>tree
        var inner: T[] = []

        for (var i in engDict) {
            inner = inner.concat(this._expand(func, engDict[i]))
        }
        return inner
    }

    _propogate<T>(func: (value: EngQ) => T, comp: Array<EngQDict>): T[] {


        var outer: Array<T> = []
        for (var i of comp) {
            var tmp = this._expand(func, i)
            outer = outer.concat(tmp)
        }
        return outer
    }

    isValid(): boolean {
        return false
    }
    dirty(): boolean {
        return true
    }
}

export class EngQ extends InterfaceEng {
    val: number
    units: string
    name: string
    range: Ranges
    private _dirty: boolean
    private _previousVal: number = undefined


    constructor(val: number, units: string, range?: Ranges, name?: string) {
        // TODO: make the NaN's do something more useful
        super()
        this.val = val ? val : NaN
        this.units = units ? units : ""
        this.name = name ? name : ""
        this.range = range ? range: <Ranges>{}
    }

    /* This function is the function called to check validity of the object */
    public isValid(): boolean {
        if (!this.val) return true
        var result: boolean[] = []
        try {
            result.push(EngMath.isNumber(this.val))
            if (this.range) {
                /* check min. */
                if (this.range.min) {
                    if (this.range.min.inclusive) {
                        result.push(this.val >= this.range.min.val)
                    } else {
                        result.push(this.val > this.range.min.val)
                    }
                }
                if (this.range.max) {
                    if (this.range.max.inclusive) {
                        result.push(this.val <= this.range.max.val)
                    } else {
                        result.push(this.val < this.range.max.val)
                    }
                }
            }

            return result.every(function(x) { return x })
        } catch (_) {
            return false;
        }
    }

    /* Updates the state of the quantity. */
    public updateState() {
        // Do stuff here to update the state
        this._previousVal = this.val
    }

    public dirty(): boolean {
        // TODO: actually do something
        if (!this._previousVal) return false
        if (this._previousVal == this.val) return false
        return true
    }
}


