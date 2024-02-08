import binaryen from "binaryen";
var cs = require("@alexaltea/capstone-js/dist/capstone.min.js");

// Input: Machine code bytes and offset where they are located
var buffer = [0x55, 0x31, 0xD2, 0x89, 0xE5, 0x8B, 0x45, 0x08];
var offset = 0x10000;

// Initialize the decoder
var d = new cs.Capstone(cs.ARCH_X86, cs.MODE_32);

// Output: Array of cs.Instruction objects
var instructions = d.disasm(buffer, offset);

// Display results;
instructions.forEach(function (instr) {
    console.log("0x%s:\t%s\t%s",
        instr.address.toString(16),
        instr.mnemonic,
        instr.op_str
    );
});

// Delete decoder
d.close();