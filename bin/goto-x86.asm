section .data
myVar db 10  ; Declare a byte variable initialized with 10

section .text
global _start
_start:
    mov al, [myVar]  ; Load the value of myVar into al