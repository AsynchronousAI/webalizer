/*
** instructions.js
** Contains the implementation of the instructions.
** Aarav Sethi
*/

import binaryen from "binaryen";
import {asmValue, args} from "./omitterfuncs";

const instructions = {
    "mov": function(instr, module){ /* 'mov' only supports copying from reg-->reg or imm-->reg */
        const operands = args(instr);

        return module.global.set(operands[0], asmValue(module, operands[1]));
    },
    "int": function(instr, module){ /* system call */
        return module.unreachable();
    },
    "xor": function(instr, module){ /* 'xor' only supports xor'ing two registers or immediate values */
        const operands = args(instr);
    
        return module.global.set(operands[0], module.i32.xor(asmValue(module, operands[0]), asmValue(module, operands[1])));
    }
};

export default instructions;