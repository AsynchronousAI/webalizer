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
export function operator(operand){ /** Convert a basic ASM Expression to WASM */
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

    i32func = data.binaryenOperators[op]
    return binaryen.i32[i32func](asmValue(left), asmValue(right));
}
export function memoryValue(module, operand){ /** Convert a memory operand into a WASM value */
    /* Example: [0x1] */
    const internal = operand.replace("[", "").replace("]", "");
    const value = isNaN(operand) ? module.local.get(regNameToLocalIndex(operand), binaryen.i32) : module.i32.const(parseInt(operand))
    return module.i32.const(0); /* Temporary solution */
}
export function asmValue(module, operand){ /** Convert an Assembly Immediate or Register into a WASM value */
    if (operand.split(" ").length == 1) {
        console.log(operand);
        if (operand.includes("[")) return memoryValue(module, operand); /* Memory values, like [0x1] */

        return isNaN(operand) ? module.local.get(regNameToLocalIndex(operand), binaryen.i32) : module.i32.const(parseInt(operand)) /* Single value, Register or immediate */;
    } else {
        return asmValue(module, operand.split(" ")[operand.split(" ").length-1]); /* Ignore all `byte ptr`, `dword ptr` etc. Keystone or another assembler already handled this */
    }
    
}
export function args(instr){ /** Convert an Assembly Instruction into an array of arguments */
    return instr.op_str.split(", ");
}

export default {asmValue, args, regNameToLocalIndex, operator};