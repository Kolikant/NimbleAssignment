const { Cache } = require("../src/cache")

describe('cache', () => {

    test("basic hit and miss", () => {
        const cache = new Cache()

        cache.read(0, 8)
        cache.read(0, 64)
        expect(cache.size).toBe(1)

        cache.read(66, 8)    
        cache.read(66, 64)    
        expect(cache.size).toBe(2)
    })

})