from capstone import *

import os
from .binaryen import *
import sys
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    # avoids annoying package import issues
    sys.path.append(current_dir)



def assemble(code, arch):
    md = Cs(*archs[arch])
    instructs = []
    for i in md.disasm(code, 0x1000):
        instructs.append({"address": i.address, "mnemonic": i.mnemonic, "op_str": i.op_str})
        print("0x%x:\t%s\t%s" %(i.address, i.mnemonic, i.op_str))

    module = binaryen["ModuleCreate"]()

    return module

archs = {
    "x86": [CS_ARCH_X86, CS_MODE_32],
    "x86-64": [CS_ARCH_X86, CS_MODE_64],
    "arm64": [CS_ARCH_ARM64, CS_MODE_ARM],
}