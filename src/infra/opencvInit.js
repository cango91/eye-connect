/* To use openCV without installing it on the server's host machine (in case of a Linux host - aka Heroku - we'd have to build opencv from source, yikes!) we'll use emscripten - a lightweight LLVM/Clang-based compiler toolchain. 
Since this (compilation/initiation) has to be asynchronous, here we will export a "singleton" function, initOpenCV, which will return the same Promise that resolves when emscripten's global Module object calls its onRuntimeInitialized property. This way we ensure the opencv library is initialized before we use it AND that it is initialized only once, no matter how many times we invoke this function.
*/
let onRuntimeInitializedPromise = null;

const initOpenCV = () =>{
    if(onRuntimeInitializedPromise) return onRuntimeInitializedPromise;
    onRuntimeInitializedPromise = new Promise(resolve => {
        global.Module = {
            onRuntimeInitialized: resolve
        };
        global.cv = require('./opencv4.8.0');
    });
    return onRuntimeInitializedPromise;
}

module.exports = initOpenCV;