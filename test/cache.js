const { Cache } = require("../src/cache")

describe('cache', () => {

    test("basic read", () => {
        const cache = new Cache()
        expect(cache.read(0, 8).length).toBe(8)
        expect(cache.read(0, 64).length).toBe(64)
        expect(cache.read(0, 125).length).toBe(125)
        expect(cache.read(23, 125).length).toBe(125)
    })

    test("basic hit and miss", () => {
        const cache = new Cache()

        cache.read(0, 8)
        cache.read(0, 64)
        expect(cache.size).toBe(1)

        cache.read(64, 8)    
        expect(cache.size).toBe(2)
        cache.read(64, 64)    
        expect(cache.size).toBe(2)
    })

    test("reading from the middle", () => {
        const cache = new Cache()

        cache.read(0, 64)
        cache.read(32, 10)
        expect(cache.size).toBe(1)
    })    


    test("LRU functionality", () => {
        //For this test to make sense need to use testing configurations in cache.js file
        const cache = new Cache()

        cache.read(0, 64)
        cache.read(64, 64)
        cache.read(128, 64)
        cache.read(192, 64)    
        expect(cache.offsetDictionary).toHaveProperty("0")
        expect(cache.offsetDictionary).toHaveProperty("64")
        expect(cache.offsetDictionary).toHaveProperty("128")
        expect(cache.offsetDictionary).toHaveProperty("192")

        cache.read(256, 64)    
        expect(cache.offsetDictionary).not.toHaveProperty("0")
        expect(cache.offsetDictionary).toHaveProperty("64")
        expect(cache.offsetDictionary).toHaveProperty("128")
        expect(cache.offsetDictionary).toHaveProperty("192")
        expect(cache.offsetDictionary).toHaveProperty("256")

        cache.read(64, 64)    
        expect(cache.offsetDictionary).toHaveProperty("128")
        expect(cache.offsetDictionary).toHaveProperty("192")
        expect(cache.offsetDictionary).toHaveProperty("256")
        expect(cache.offsetDictionary).toHaveProperty("64")

        cache.read(0, 64)    
        expect(cache.offsetDictionary).not.toHaveProperty("128")
        expect(cache.offsetDictionary).toHaveProperty("192")
        expect(cache.offsetDictionary).toHaveProperty("256")
        expect(cache.offsetDictionary).toHaveProperty("64")
        expect(cache.offsetDictionary).toHaveProperty("0")
    })   
})