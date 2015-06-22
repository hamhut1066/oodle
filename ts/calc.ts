/// <reference path="../typings/custom/engq.d.ts" />
export interface CalcDict {
    [key: string]: Calc
}

export class Calc extends InterfaceEng {
    children: CalcDict
    value: EngQ
    _do: (calc: Calc) => any

    constructor(_in: EngQ | EngQDict, _do: (calc: Calc) => any) {
        super()
        _in ? this.children = this.init(_in) : this.children = undefined
        this._do = _do ? _do : function() {}
        for (var i in this.children) {
            this[i] = <Calc>this.children[i]
        }
    }

    get val() {
        if (this.value) {
            return this.value.val
        }
    }

    set val(value: number) {
        if (this.value) {
            this.value.val = value 
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
        if (this.value) {
            this.value.updateState()
        }
        this.walk(function(node) {
            node.updateState()
        })
    }

    public run<R>(): Promise<R> {
        if(this.isValid.call(this)) {
            // Create Promise here
            var promise = new Promise(
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
                        console.log("The Calc is invalid")
                    }

        return promise
    }

    /* check if any subnodes are dirty */
    public dirty(): boolean {
        var result: boolean[] = []
        if (this.value) {
            result.push(this.value.dirty())
        }
        result = result.concat(this.walk(function(node: Calc): boolean {
            return node.dirty()
        }))
        return result.some(function(x) { return x })
    }

    /* Propogates through the tree, and checks everything is valid. */
    public isValid(): boolean {
        var result: boolean[] = []
        if (this.value) {
            result.push(this.value.isValid())
        }
        result = result.concat(this.walk(function(node: Calc): boolean {
            return node.isValid()
        }))
        return result.every(function(x) { return x })
    }

    /* Returns The Subtree of the current Node */
    init(tree: EngQ | EngQDict): CalcDict {
        if (tree instanceof EngQ
            || tree instanceof Array) {
            this.value = <EngQ>tree
            return undefined
        }

        return <CalcDict>this.build(tree)
    }
    build(tree: EngQDict, name?: string): Calc | CalcDict {
        var result = <CalcDict>{}
        if (tree instanceof EngQ) {
            console.warn("Deprecated Funtionality, this shouldn't be running")
            return new Calc(tree, undefined)
        }

        var nodeDict = <EngQDict>tree
        for (var i in nodeDict) {
            result[i] = new Calc(nodeDict[i], undefined)
        }
        return result
    }
}
