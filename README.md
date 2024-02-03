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
- `pip install pybinaryen`
- `pip install capstone`
- `pip install ply`
## Using on Apple Silicon:
### Checking if you are on Apple Silicon:
- Run `arch` in the terminal, if it returns `arm64`, you are on Apple Silicon.

The system is designed to work on x86_64, but it can be used on Apple Silicon using the following steps:
- Uninstall `capstone` if it is installed: `pip uninstall capstone`
- Install homebrew if you havent
- Install `capstone` using homebrew: `arch -arm64 brew install capstone`
- Reinstall capstone, force it to use the Apple Silicon variant: `pip install --no-cache-dir --global-option=build_ext --global-option="-L/opt/homebrew/lib" --global-option="-I/opt/homebrew/include" capstone`
## Converting compiled applications:
You can use `objdump` to convert compiled applications to Intel Syntax Assembly:
- `objdump -d myexec -M intel > myexec.asm`
and then put that through the tool.
# Credits:
- [pybinaryen]
- [capstone]
- [EiNsTeiN-'s Decompiler](https://github.com/EiNSTeiN-/decompiler)
***
# Usage:
```py
import webalizer
module = webalizer.assemble(source, arch)

wat = module.text()
wasm = module.binary()
```