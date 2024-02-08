import binaryen from "binaryen";

const instructions = {

};

/* CORE */
export function omit(instr, module){
    return module.unreachable();
}
export function init(module){

}
export function finish(module){
    module.addFunctionExport("main", "main");
}