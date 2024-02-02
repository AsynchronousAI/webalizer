from capstone import *
from .decompiler import *
from .host import dis
from .output import c


def assemble(code, arch):
    md = Cs(*archs[arch])

    disasm = dis.available_disassemblers['capstone'].create(md, code, 0x1000)
    dec = decompiler_t(disasm, 0x1000)

    dec.step_until(step_decompiled)
    return (''.join([str(o) for o in c.tokenizer(dec.function).tokens]))

archs = {
    "x86": [CS_ARCH_X86, CS_MODE_32],
    "x86-64": [CS_ARCH_X86, CS_MODE_64],
    "arm": [CS_ARCH_ARM, CS_MODE_ARM],
    "arm-thumb": [CS_ARCH_ARM, CS_MODE_THUMB],
    "arm64": [CS_ARCH_ARM64, CS_MODE_ARM],
    "mips": [CS_ARCH_MIPS, CS_MODE_MIPS32],
    "mips64": [CS_ARCH_MIPS, CS_MODE_MIPS64],
    "powerpc": [CS_ARCH_PPC, CS_MODE_32],
    "powerpc64": [CS_ARCH_PPC, CS_MODE_64],
}