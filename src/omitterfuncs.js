/*
** ommiterfuncs.js
** Commonly used functions for the ommitter.
** Aarav Sethi
*/

export function asmValue(module, operand){ /** Convert an Assembly Immediate or Register into a WASM value */
    return isNaN(operand) ? module.global.get(operand) : module.i32.const(parseInt(operand))
}
export function args(instr){ /** Convert an Assembly Instruction into an array of arguments */
    return instr.op_str.split(", ");
}
export default {asmValue, args};