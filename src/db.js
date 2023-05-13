const readFromDB = function(offset, size) {
    //fabricate random data in KB size
    const a = Array.from({length: size}, () => Math.floor(Math.random() * size));    
    return a
}

module.exports = { readFromDB }