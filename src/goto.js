/*
** goto.js
** Contains a wrapper and utility functions to use goto in WASM.
** Aarav Sethi
*/

import binaryen from "binaryen";

function label(module, name){
    return module.block(name, []);
}
function goto(module, name){
    return module.block(name, []);
}
function gotoBlock(module, src){
    return module.block(null, [].concat(src));
}

export default {label, goto, gotoBlock};