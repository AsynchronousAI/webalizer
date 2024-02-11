section .text
global _start

_start:
    mov ebx, 1 ; set ebx to 1
    add ebx, 1 ; add 1 to ebx (1+1)
    cmp eax, 2 ; if 1+1 == 2
    je label1 ; jump to label1

label1:
    mov eax, 1 ; set exit code to 1