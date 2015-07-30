/// <reference path="./engq.ts" />
/// <reference path="./interfaceeng.ts" />

module oodle {
    interface CalcDict {
        [key: string]: Calc
    }

    export class Calc extends InterfaceEng {
        children: CalcDict
        _value: EngQ
        _do: (calc: Calc) => any

        constructor(_in: EngQDict, _do: (calc: Calc) => any) {
            super()
            _in ? this.children = this.init(_in) : this.children = undefined
            this._do = _do ? _do : function() {}
            for (var i in this.children) {
                this[i] = this.children[i]
            }
        }

        // Setters to Access Attributes of Data on Node.
        get val() {
            if (this._value) {
                return this._value.val
            }
        }

        set val(_value: number) {
            if (this._value) {
                this._value.val = _value
            }
        }

        get units() {
            if (this._value) {
                return this._value.units
            }
        }

        set units(units: string ) {
            if (this._value) {
                this._value.units = units
            }
        }

        walk<T>(func: (node: Calc) => T): T[] {
            var result: T[] = []
            for (var i in this.children) {
                result.push(func(this.children[i]))
            }
            return result
        }

        updateState() {
            if (this._value) {
                this._value.updateState()
            }
            this.walk(function(node) {
                node.updateState()
            })
        }

        /* Run the attached method over the Calculation. */
        public run<R>(): Promise<R> {
            var promise

            if(this.isValid.call(this)) {
                promise = new Promise(
                    function(resolve: (value?: R | Thenable<R>) => void, reject: (error?: any) => void) {
                        try {
                            var value = this._do.call(this, this)
                            resolve(value)
                        } catch(e) {
                            reject(e)
                        }

                    }.bind(this))

                promise.then(
                    function(object: any) {
                        this.out = object
                        /* update state of the structure */
                        this.updateState()
                        return object
                    }.bind(this))
                    .catch(function(e) {
                        console.error(e);
                    })
            } else {
                promise = new Promise(function(_, reject) {
                    reject(new Error("CalculationInvalid"))
                })
            }
            return promise
        }

        /* check if any subnodes are dirty */
        public dirty(): boolean {
            var result: boolean[] = []
            if (this._value) {
                result.push(this._value.dirty())
            }
            result = result.concat(this.walk(function(node: Calc): boolean {
                return node.dirty()
            }))
            return result.some(function(x) { return x })
        }

        /* Propogates through the tree, and checks everything is valid. */
        public isValid(): boolean {
            var result: boolean[] = []
            if (this._value) {
                result.push(this._value.isValid())
            }
            result = result.concat(this.walk(function(node: Calc): boolean {
                return node.isValid()
            }))
            return result.every(function(x) { return x })
        }

        /* Returns The Subtree of the current Node */
        init(tree: EngQ | EngQDict): CalcDict {
            if (tree instanceof EngQ) {
                // || tree instanceof Array) {
                this._value = <EngQ>tree
                return undefined
            }

            return this.build(<EngQDict>tree)
        }
        build(tree: EngQDict, name?: string): CalcDict {
            var result = <CalcDict>{}

            var nodeDict = <EngQDict>tree
            for (var i in nodeDict) {
                result[i] = new Calc(<EngQDict>nodeDict[i], undefined)
            }
            return result
        }
    }
}
