module oodle {
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
}
