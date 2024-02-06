# webalizer
Assembler that compiles to WebAssembly.
# Metadata:
## Story:
Here at Unexex we believe in the Web and the power of WebAssembly. This tool can be used to port applications or commandlinetools to the web as a WebAssembly module.
## Status:
Stable, not reccomended for production.
### Unsupported:
- System calls, planned to be bindable to JavaScript.
- Windows.
# Installation:
## Dependencies:
- capstone
- wasmtime
***
# Usage:
```py
import webalizer
module = webalizer.assemble(source, arch) # Returns a pybinaryen module
module.ModuleOptimize() # Optimizes the module
```
## Installing Dependencies:
- `pip install capstone wasmtime`
- Homebrew (macOS)
- apt-get (Linux)
- choco (Windows)
## Installing Binaryen:
Binaryen is required to compile to WebAssembly and optimize the module.
### macOS & Linux:
- Download the correct version from`https://github.com/WebAssembly/binaryen/releases`
- Move `include` to `/usr/local/include`
- Move conents of `lib` to `/usr/local/lib`
- Move conents of `bin` to `/usr/local/bin`
### Windows:
- Download the windows version from `https://github.com/WebAssembly/binaryen/releases`
- Add the `bin` folder to the PATH
- Add the `include` folder to the include path
- Add the `lib` folder to the library path
## Installing Capstone (Apple Silicon only):
The system works on x86_64 out of the box, but it can be used on Apple Silicon using the following steps:
- Uninstall `capstone` if it is installed: `pip uninstall capstone`
- Install `capstone` using homebrew: `arch -arm64 brew install capstone`
- Reinstall capstone, force it to use the Apple Silicon variant: `pip install --no-cache-dir --global-option=build_ext --global-option="-L/opt/homebrew/lib" --global-option="-I/opt/homebrew/include" capstone`
# Internals:
## Binaryen:
This tool is written in python and uses `binaryen` javascript library via compiling it to WASM and using `wasmtime`.
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
For the instructions the memory is stored natively in WASM, all data is stored as a f64.

## Optimizer:
The optimization process is:
- Put the decompiled assembly through our own optimizer (planned)
- Use `wizer`
- Use `wasm-opt`
