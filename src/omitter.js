import binaryen from "binaryen";

const instructions = {
    "mov": function(instr, module){ /* 'mov' only supports copying from reg-->reg or imm-->reg */
        const str = instr.op_str;
        const operands = str.split(", ");
        return module.global.set(operands[0], isNaN(operands[1]) ? module.global.get(operands[1]) : module.i32.const(parseInt(operands[1])));
    },
};

/* CORE */
export function omit(instr, module, arch){
    if (instr.mnemonic in instructions){
        return instructions[instr.mnemonic](instr, module);
    }
    console.warn("Instruction '" + instr.mnemonic + "' not implemented.");
    return module.unreachable();
}
export function init(module, arch){
    /* stack */
    module.setMemory(1, 1, false, false, false, false, "memory");
    module.addGlobal("sp", binaryen.i32, true, module.i32.const(0));

    /* define registers */
    module.addGlobal("eax", binaryen.i32, true, module.i32.const(0));
    module.addGlobal("ebx", binaryen.i32, true, module.i32.const(0));
    module.addGlobal("ecx", binaryen.i32, true, module.i32.const(0));
    module.addGlobal("edx", binaryen.i32, true, module.i32.const(0));
}
export function finish(module){
    module.addFunctionExport("main", "main");
}