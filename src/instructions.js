/*
** instructions.js
** Contains the implementation of the instructions.
** Aarav Sethi
*/

import binaryen from "binaryen";
import {asmValue, args, regNameToLocalIndex} from "./omitterfuncs";
import data from "./data.js";

const instructions = {
    "mov": function(instr, module){ /* 'mov' only supports copying from reg-->reg or imm-->reg */
        const operands = args(instr);

        return module.local.set(regNameToLocalIndex(operands[0]), asmValue(module, operands[1]));
    },
    "int": function(instr, module, inturrupt){ /* system call */
        if (!inturrupt) throw new Error("Inturrupt mode is off.");
        return module.call("inturrupt", [asmValue(module, instr.op_str)]);
    }
};

export default instructions;