/*
** index.js
** Primary interface for the webalizer.
** Aarav Sethi
*/

/* dependencies */
import binaryen from "binaryen";
import logSymbols from 'log-symbols';
import data from "./data.js";

var cs = require("@alexaltea/capstone-js/dist/capstone.min.js");
var ks = require("./keystone.min.js");

const cliProgress = require('cli-progress');

/* core */
import {init, omit, finish, finishFuncs, initFuncs} from "./omitter.js";

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
        console.log(logSymbols.success, "Compiling assembly...");

        var ks1 = new ks.Keystone(arch2, mode2);
        ks1.option(ks.OPT_SYNTAX, ks.OPT_SYNTAX_INTEL);
        buffer = ks1.asm(buffer);
        if (buffer.failed){
            console.error(logSymbols.error, "Failed to compile assembly.");
            return new binaryen.Module();
        }
        buffer = buffer.mc;
        ks1.close();
    }

    console.log(logSymbols.success, "Disassembling binary...");
    var d = new cs.Capstone(arch1, mode1);
    var instructions = d.disasm(buffer, offset);

    /* Start instance */
    console.log(logSymbols.success, "Initializing WebAssembly module...");
    const module = new binaryen.Module();

    /* Compile */
    console.log(logSymbols.success, "Compiling instructions...");
    
    const bar = new cliProgress.SingleBar({
            format: '{bar} {percentage}% | {value}/{total} instructions',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
        }, cliProgress.Presets.legacy);
    bar.start(instructions.length, 0);
    
    /** Registers -> WASM Locals */
    var types = []
    for (var i = 0; i < data.registers.length; i++){
        types.push(binaryen.i32);
    }

    /** Main */
    init(module, arch, inturrupt); // adds initializers 
    module.addFunction("main", binaryen.none, binaryen.i32, types, 
        module.block(null, initFuncs(module).concat(instructions.map(function (instr) {
            /*console.log("0x%s:\t%s\t%s",
                instr.address.toString(16),
                instr.mnemonic,
                instr.op_str
            );*/
            bar.increment();
            return omit(instr, module, arch, inturrupt);
        }).concat(finishFuncs(module))
        )));
    finish(module); // adds exports

    /* Clean */
    d.close(); // close capstone
    bar.stop(); // close progress bar

    /* Validate and optimize */
    try {
        module.validate();
        module.optimize();
    } catch (e){
        console.log(logSymbols.error, "failed to validate and optimize"); // warn user, and provide error
    }

    return module;
}
