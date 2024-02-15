/*
** stack.js
** Contains an initializer and functions for stack system.
** Aarav Sethi
*/

import binaryen from "binaryen";

export default function stackInit(module){
    module.setMemory(1, 1, "stack");
    module.addFunction("push", binaryen.i32, binaryen.none, [], module.block(null, [ /* take in a value and push it to the stack */
        
    ]));
    module.addFunction("pop", binaryen.none, binaryen.i32, [], module.block(null, [ /* take in no values and return the value on the top of the stack, popping it */
        
    ]));
}