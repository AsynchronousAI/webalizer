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
var arch = "x86";

var module = webalizer(buffer, offset, arch)

console.log(module.emitText()); // Output WAT
```
## Installing Dependencies:
- `npm i`
# Internals:
## Binaryen:
This tool uses binaryen to generate WASM, WAT and other formats and optimize.
## Parser:
The parser is written in python and uses `capstone` to disassemble the source code, capstone returns a list of instructions which are then put through a visitor pattern to generate the WebAssembly module.
## Visitor:
The visitor is the biggest part of the tool, it takes the disassembled instructions and turns it into a Binaryen AST to be compiled into WebAssembly.
### Goto's:
WebAssembly does not support goto's, so we implemented a `chunk` system, where each chunk is a block of code that can be jumped to.
#### Example (pseudo code):
```c
int a = 0;
if (a == 0) {
  goto end;
}
a = 1;
end:
return a;
```
This will be chunked into:
```c
int chunk1() {
    int a = 0;
    if (a == 0) {
        return chunk2();
    }
    a = 1;
}
int chunk2() {
  return a;
}
```
This example is just an example, the actual implementation is more complicated.
### Memory:
Like ASM, we allocate a chunk of memory and use a stack to store variables.
## Optimizer:
The optimization process is:
- Use `wizer`
- Use `wasm-opt`
