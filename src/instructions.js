/*
** instructions.js
** Contains the implementation of the instructions.
** Aarav Sethi
*/

import binaryen from "binaryen";
import {asmValue, args, regNameToLocalIndex} from "./omitterfuncs";
import data from "./data.js";
import goto from "./goto.js";

const instructions = {
    /* variables */
    "mov": function(instr, module){ /* 'mov' only supports copying from reg-->reg or imm-->reg */
        const operands = args(instr);

        return module.local.set(regNameToLocalIndex(operands[0]), asmValue(module, operands[1]));
    },

    /* system */
    "int": function(instr, module, inturrupt){ /* system call only one arg */
        if (!inturrupt) throw new Error("Inturrupt mode is off.");
        return module.call("inturrupt", [asmValue(module, instr.op_str)]);
    },
    "syscall": function(instr, module, inturrupt){ /* system call doesnt support args */
        if (!inturrupt) throw new Error("Inturrupt mode is off.");
        return module.call("inturrupt", [module.i32.const(0x80)]);
    },

    /* operations */
    "add": function(instr, module){ /* add reg, imm. Only supports 2 arguments */
        const operands = args(instr);
        return module.local.set(regNameToLocalIndex(operands[0]), module.i32.add(module.local.get(regNameToLocalIndex(operands[0]), binaryen.i32), asmValue(module, operands[1])));
    },
    "sub": function(instr, module){ /* sub reg, imm. Only supports 2 arguments */
        const operands = args(instr);
        return module.local.set(regNameToLocalIndex(operands[0]), module.i32.sub(module.local.get(regNameToLocalIndex(operands[0]), binaryen.i32), asmValue(module, operands[1])));
    },
    "cmp": function(instr, module){ /* compare. Only supports 2 arguments */
        const operands = args(instr);
        const a = module.local.get(regNameToLocalIndex(operands[0]), binaryen.i32);
        const b = asmValue(module, operands[1]);

        return module.global.set("pass", module.i32.sub(a, b));
    },
    "and": function(instr, module){ /* and. Only supports 2 arguments */
        const operands = args(instr);
        return module.local.set(regNameToLocalIndex(operands[0]), module.i32.and(module.local.get(regNameToLocalIndex(operands[0]), binaryen.i32), asmValue(module, operands[1])));
    },
    "or": function(instr, module){ /* or. Only supports 2 arguments */
        const operands = args(instr);
        return module.local.set(regNameToLocalIndex(operands[0]), module.i32.or(module.local.get(regNameToLocalIndex(operands[0]), binaryen.i32), asmValue(module, operands[1])));
    },
    "xor": function(instr, module){ /* xor. Only supports 2 arguments */
        const operands = args(instr);
        return module.local.set(regNameToLocalIndex(operands[0]), module.i32.xor(module.local.get(regNameToLocalIndex(operands[0]), binaryen.i32), asmValue(module, operands[1])));
    },

    /* goto */
    "label": function(instr, module){ /* label */
        return goto.label(module, instr.op_str);
    },
    "jmp": function(instr, module){ /* jump */
        return goto.goto(module, instr.op_str);
    },
    "je": function(instr, module){ /* jump if equal */
        return module.if(module.i32.eq(module.global.get("pass", binaryen.i32), module.i32.const(0)), goto.goto(module, instr.op_str));
    },
    "jne": function(instr, module){ /* jump if not equal */
        return module.if(module.i32.ne(module.global.get("pass", binaryen.i32), module.i32.const(0)), goto.goto(module, instr.op_str));
    },
};

export default instructions;