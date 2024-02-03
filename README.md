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
- `pip install capstone`
# Credits:
- [pybinaryen]
- [capstone]
- [EiNsTeiN-'s Decompiler](https://github.com/EiNSTeiN-/decompiler)
***
# Usage:
```py
import webalizer
module = webalizer.assemble(source, arch) # Returns a pybinaryen module
module.ModuleOptimize() # Optimizes the module
```
## Installing Dependencies:
- `pip install capstone`
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