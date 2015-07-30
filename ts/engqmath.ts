module EngMath {

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
