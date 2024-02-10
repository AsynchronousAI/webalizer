/*
** ommiterfuncs.js
** Commonly used functions for the ommitter.
** Aarav Sethi
*/

import binaryen from "binaryen";
import data from "./data.js";

export function regNameToLocalIndex(reg){ /** Convert a register name to a local index */
    return data.registers.indexOf(reg);
}
export function asmValue(module, operand){ /** Convert an Assembly Immediate or Register into a WASM value */
    return isNaN(operand) ? module.local.get(regNameToLocalIndex(operand), binaryen.i32) : module.i32.const(parseInt(operand))
}
export function args(instr){ /** Convert an Assembly Instruction into an array of arguments */
    return instr.op_str.split(", ");
}
export default {asmValue, args, regNameToLocalIndex};