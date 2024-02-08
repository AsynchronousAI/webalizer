import binaryen from "binaryen";
var cs = require("@alexaltea/capstone-js/dist/capstone.min.js");

import {init, omit, finish} from "./omitter.js";

export default function webalizer(buffer, offset, arch){
    var arch1, mode1;
    if (arch === "x86"){
        arch1 = cs.ARCH_X86;
        mode1 = cs.MODE_32;
    } else if (arch === "x64"){
        arch1 = cs.ARCH_X86;
        mode1 = cs.MODE_64;
    } else if (arch === "arm"){
        arch1 = cs.ARCH_ARM;
        mode1 = cs.MODE_ARM;
    } else if (arch === "arm64"){
        arch1 = cs.ARCH_ARM64;
        mode1 = cs.MODE_ARM;
    }

    var d = new cs.Capstone(arch1, mode1);

    var instructions = d.disasm(buffer, offset);

    const module = new binaryen.Module();

    init(module);

    instructions.forEach(function (instr) {
        omit(instr, module);
        console.log("0x%s:\t%s\t%s",
            instr.address.toString(16),
            instr.mnemonic,
            instr.op_str
        );
    });

    finish(module);

    module.optimize();

    return module;
}