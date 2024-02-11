const registers = [
    "", /* "" is system reserved */
    "eax", "ebx", "ecx", "edx", "edi", /* main registers */
    "ebp", "esp", "eip", "eflags", /* system registers */
    "al", "ah", "bl", "bh", "cl", "ch", "dl", "dh", /* low/high byte registers */
    "ax", "bx", "cx", "dx", /* low/high word registers */
    "si", "di", "bp", "sp", /* index registers */
    "cs", "ds", "es", "fs", "gs", "ss", /* segment registers */
    "flags", /* flags register */
    "rax", "rbx", "rcx", "rdx", "rsi", "rdi", "rbp", "rsp", "rip", /* 64-bit registers */
];  /* Report any missing or failed registers in `meta.unexex.tech` */

const operators = ["+", "-", "*", "/", "^", "|", "&"]; /* All supported ASM operators. */
const binaryenOperators = { /* ASM operators and their binaryen.i32[operator] equivalents. */
    "+": "add",
    "-": "sub",
    "^": "xor",
    "|": "or",
    "&": "and",
    "*": "mul",
    "/": "div_s"
};

export default {registers, operators, binaryenOperators};