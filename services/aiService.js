const init = require('../infra/opencvInit');

const preprocess = async (array) =>{
    init();
}

const predict = async (buffer) =>{
    return buffer;
}

const classifyFunduscopy = async (funduscopy) =>{
    return {
        vaule: 0.5,
        result: 'No classification. Must be seen by specialist'
    };
}

module.exports = {
    predict,
    classifyFunduscopy,
}