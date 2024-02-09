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
    "int": function(instr, module, inturrupt){ /* system call */
        if (!inturrupt) throw new Error("Inturrupt mode is off.");
        return module.call("inturrupt", [asmValue(module, instr.op_str)]);
    },
    "xor": function(instr, module){ /* 'xor' only supports xor'ing two registers or immediate values */ // TODO: fix
        const operands = args(instr);
    
        return module.global.set(operands[0], module.i32.xor(asmValue(module, operands[0]), asmValue(module, operands[1])));
    }
};

export default instructions;