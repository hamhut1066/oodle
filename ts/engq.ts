// The engineering quantity object.
/// <reference path="../typings/es6-promise/es6-promise.d.ts" />
/// <reference path="./ranges.ts" />
/// <reference path="./engqmath.ts" />
/// <reference path="./engqdict.ts" />
/// <reference path="./interfaceeng.ts" />

module oodle {

    export interface EngQDict {
        // NOTE: This defines recursion! this can potentially go wrong!! BE WARNED!!
        [key: string]: EngQ | EngQDict

        // The following keys are here to fix errors on type flow
    }

    interface EngqHash {
        range?: Ranges,
        name?: string
    }

    export class EngQ extends InterfaceEng {
        val: number
        units: string
        name: string
        range: Ranges
        private _dirty: boolean
        private _previousVal: number = undefined


        constructor(val: number, units: string, _hash?: EngqHash) { // range?: Ranges, name?: string) {
            // TODO: make the NaN's do something more useful
            super()
            var hash = _hash || {}
            this.val = val
            this.units = units
            this.name = hash.name || ""
            this.range = hash.range || <Ranges>{}
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
}
