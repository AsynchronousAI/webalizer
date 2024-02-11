# webalizer
Assembler that compiles to WebAssembly.
# Metadata:
## Story:
Here at Unexex we believe in the Web and the power of WebAssembly. This tool can be used to port applications or commandlinetools to the web as a WebAssembly module.
## Status:
Stable, not reccomended for production.
### Unsupported:
- System calls, planned to be bindable to JavaScript.
# Installation:
## Dependencies:
- capstone
- binaryen
## Credits:
- @AlexAltea for capstone.js (dependency) and keystone.js (modified in source).
- AssemblyScript for Binaryen.js (dependency).
***
# Usage:
```js
import webalizer from "./src/index.js";

var buffer = [0x55, 0x31, 0xD2, 0x89, 0xE5, 0x8B, 0x45, 0x08];
var offset = 0x10000;

var module = webalizer(buffer, offset)

console.log(module.emitText()); // Output WAT
```
```js
import webalizer from "./src/index.js";

var buffer = `
inc   rax;
call  0x10040;
mov   rax, qword ptr[rdx + 4];
sub   esp, 0x100;
pop   rbx;
` // x86 intel syntax is supported as a buffer.
var offset = 0x10000;

console.log(webalizer(buffer, offset).emitText());
```

## Installing Dependencies:
- `npm i`
# TODO:
- Goto
- Memory stack
- Memory values `[]`
- Support for all x86 instructions
- Support for all x86 registers
- Functions
- Static data

# Errors:
## `local.get index must be small enough`
```
[wasm-validator error in function main] unexpected false: local.get index must be small enough, on 
(local.get $4294967295)
[wasm-validator error in function main] unexpected false: local.set index must be small enough, on 
(local.set $4294967295
 (local.get $4294967295)
)
Aborted(Assertion failed: index < base + vars.size(), at: /home/runner/work/binaryen.js/binaryen.js/binaryen/src/wasm/wasm.cpp,1314,isVar)
```
This error means that you are using an unsupported register that has not been mapped, resulting in the index being the maximum value of a 32 bit integer.
## `RuntimeError: Aborted(Assertion failed: *currp, at: /home/runner/work/binaryen.js/binaryen.js/binaryen/src/wasm-traversal.h,313,pushTask). Build with -sASSERTIONS for more info.`
This is an internal error where generated WASM code is invalid, and should be reported to the issue tracker.
## `error: Capstone.js: Function cs_disasm failed with code 0: OK (CS_ERR_OK)`
This error means that the buffer is not a Uint8Array or a ASM string, and should be converted to one. This can be done using `new Uint8Array(buffer)`.
# Architecture:
## Files & Control Flow:
### `src/index.js` - Main entry point.
- Take in a buffer, and an offset.
- If buffer is a string, compile it to a buffer using Keystone.
- Take the buffer and the offset and convert it to a list using Capstone.
- Create a main function for binaryen.
- Add the initial commands.
- Use omitter to visit instructions and add them to the main function.
- Add the return commands.
- Return the module.
### `src/omitter.js` - Omitter.
- Take in a instruction and arguments.
- Use `instructions.js` to return Binaryen instructions.
- Expose functions for initializing and finishing the module.
### `src/ommiterfuncs.js` - Omitter functions.
Functions used in the ommiter and in instructions, for example compiling an ASM Register to a WASM Local Index.
### `src/instructions.js` - Instructions.
- Take in a instruction and arguments.
- Return a Binaryen instruction depending on the instruction and arguments.
### `src/data.js` - Datas.
Holds constant data, for example the register names.
### 'src/keystone.min.js' - Keystone.
A modified version of keystone.js. Large file, do not directly modify.

## Goto:
Since WASM does not support goto's we use a loop and a conditional to simulate a goto.