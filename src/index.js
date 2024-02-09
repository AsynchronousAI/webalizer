/*
** index.js
** Primary interface for the webalizer.
** Aarav Sethi
*/

/* dependencies */
import binaryen from "binaryen";
var cs = require("@alexaltea/capstone-js/dist/capstone.min.js");
var ks = require("./keystone.min.js");

/* core */
import {init, omit, finish, finishFuncs} from "./omitter.js";

/* Binary -> WebAssembly */
export default function webalizer(buffer, offset, arch, inturrupt = false){
    /* Convert architecture to capstone constants */
    var arch1, mode1, arch2, mode2; /* x86 */
    arch1 = cs.ARCH_X86;
    mode1 = cs.MODE_32;

    arch2 = ks.ARCH_X86;
    mode2 = ks.MODE_32;

    /* Disassemble */
    /** If we are provided Assembly compile */
    if (typeof buffer === "string"){
        var ks1 = new ks.Keystone(arch2, mode2);
        ks1.option(ks.OPT_SYNTAX, ks.OPT_SYNTAX_INTEL);
        buffer = ks1.asm(buffer);
        if (buffer.failed){
            console.error("Failed to compile assembly.");
            return new binaryen.Module();
        }
        buffer = buffer.mc;
        ks1.close();
    }
    var d = new cs.Capstone(arch1, mode1);
    var instructions = d.disasm(buffer, offset);

    /* Start instance */
    const module = new binaryen.Module();

    /* Compile */
    init(module, arch, inturrupt); // adds initializers 
    module.addFunction("main", binaryen.none, binaryen.i32, binaryen.none, 
        module.block(null, instructions.map(function (instr) {
            console.log("0x%s:\t%s\t%s",
                instr.address.toString(16),
                instr.mnemonic,
                instr.op_str
            );
            return omit(instr, module, arch, inturrupt);
        }).concat(finishFuncs(module)
    )));
    finish(module); // adds exports

    /* Clean */
    d.close(); // close capstone to 

    /* Validate and optimize */
    try {
        module.validate();
        module.optimize();
    } catch (e){
        console.warn("Generated code may be faulty, failed to validate and optimize: " + e); // warn user, and provide error
    }

    return module;
}
