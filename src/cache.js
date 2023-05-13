//input configs ------------------------------------------------------------------

const cacheSizeInMegaBytes = 10 
const cacheSizeInMegaBytesTesting = 0.25 

const metaDataSizeInKiloBytes = 8
const DataChunkSizeInKiloBytes = 64

//parsed configs ------------------------------------------------------------------

// const cacheSizeInKiloBytes = cacheSizeInMegaBytes * 1024 
const cacheSizeInKiloBytes = cacheSizeInMegaBytesTesting * 1024 

const cacheNodesAmount = cacheSizeInKiloBytes / DataChunkSizeInKiloBytes // 160(prod) - 4(testing)

//logic ------------------------------------------------------------------

const { DoublyLinkedList } = require("./doublyLinkedList")
const { readFromDB } = require("./db")


class Cache {
    constructor() {
        this.offsetDictionary = {

        }
        this.cache = new DoublyLinkedList()
    }

    get size() {
        return Object.keys(this.offsetDictionary).length
    }

    searchForOffset (offset) {
        for(var key in this.offsetDictionary) {
            if(+key === offset) {
                return this.offsetDictionary[key]
            }
        }    
        return null
    }

    makeMostRecentlyUsed (node) {
        this.cache.remove(node.value)
        this.cache.insertFirst(node.value)
    }

    addNodeToCache (Node) {
        if(this.cache.size >= cacheNodesAmount) {
            const tail = this.cache.tail
            delete this.offsetDictionary[tail.value.offset]
            this.cache.removeLast()
        }
        this.cache.insertFirst(Node)
        this.offsetDictionary[Node.offset] = this.cache.head
    }

    calculateRequiredChunks(offset, size) {
        let chunks = []
        const firstChunkOffset = Math.floor(offset/DataChunkSizeInKiloBytes) * DataChunkSizeInKiloBytes
        const lastChunkOffset = Math.floor((offset + size - 1) / DataChunkSizeInKiloBytes) * DataChunkSizeInKiloBytes

        for(let i = firstChunkOffset; i <= lastChunkOffset; i += DataChunkSizeInKiloBytes) {
            chunks.push(i)
        }

        return chunks
    }

    parseTotalChunkData(totalData, offset, size) {
        const firstChunkOffset = Math.floor(offset/DataChunkSizeInKiloBytes) * DataChunkSizeInKiloBytes
        return totalData.slice(offset - firstChunkOffset, offset - firstChunkOffset + size)
    }

    read (offset, size) {
        const requiredChunks = this.calculateRequiredChunks(offset, size)
        const chunks = requiredChunks.map((offset) => {
            const offsetNode = this.searchForOffset(offset)
            if(offsetNode !== null) {
                this.makeMostRecentlyUsed(offsetNode)
                return offsetNode.value.data
            }
    
            const data = readFromDB(offset, DataChunkSizeInKiloBytes)
            const newNode = { offset, data }
            this.addNodeToCache(newNode)
            return data
        })
        const totalData = chunks.join().split(",")
        const retVal = this.parseTotalChunkData(totalData, offset, size)
        return retVal
    }
}

module.exports = { Cache }