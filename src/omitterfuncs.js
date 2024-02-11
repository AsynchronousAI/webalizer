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
export function operator(operand){ /** Convert an ASM Expression to WASM */
    var left, op, right;

    for (var i = 0; i < data.operators.length; i++){
        if (operand.includes(data.operators[i])){
            op = data.operators[i];
            left = operand.split(op)[0];
            right = operand.split(op)[1];
            break;
        }
    }

    if (op === undefined) throw new Error("Alphanemeric value given without operator.");

    i32func = {
        "+": "add",
        "-": "sub",
        "^": "xor",
        "|": "or",
        "&": "and",
        "*": "mul",
        "/": "div_s"
    }[op]
    return binaryen.i32[i32func](asmValue(left), asmValue(right));
}
export function asmValue(module, operand){ /** Convert an Assembly Immediate or Register into a WASM value */
    return isNaN(operand) ? module.local.get(regNameToLocalIndex(operand), binaryen.i32) : module.i32.const(parseInt(operand))
}
export function args(instr){ /** Convert an Assembly Instruction into an array of arguments */
    return instr.op_str.split(", ");
}

export default {asmValue, args, regNameToLocalIndex, operator};