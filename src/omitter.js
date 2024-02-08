import binaryen from "binaryen";

export function omit(instr, module){

}
export function init(module){
    module.addFunction("add", binaryen.createType([ binaryen.i32, binaryen.i32 ]), binaryen.i32, [ binaryen.i32 ],
    module.block(null, [
        module.local.set(2,
            module.i32.add(
                module.local.get(0, binaryen.i32),
            module.local.get(1, binaryen.i32)
        )
        ),
        module.return(
            module.local.get(2, binaryen.i32)
        )
    ])
    );
}
export function finish(module){
    module.addFunctionExport("add", "add");
}