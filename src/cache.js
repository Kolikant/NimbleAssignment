//input configs ------------------------------------------------------------------

const cacheSizeInMegaBytes = 10 

const metaDataSizeInKiloBytes = 8
const DataChunkSizeInKiloBytes = 64

//parsed configs ------------------------------------------------------------------

const cacheSizeInKiloBytes = cacheSizeInMegaBytes * 1024 

const cacheNodesAmount = cacheSizeInKiloBytes / DataChunkSizeInKiloBytes // 160

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
            tail = this.cache.tail
            delete this.offsetDictionary[tail.value.offset]
            this.cache.removeLast()
        }
        this.cache.insertFirst(Node)
        this.offsetDictionary[Node.offset] = this.cache.head
    }

    read (offset, size) {
        try {
            const offsetNode = this.searchForOffset(offset)
            if(offsetNode !== null) {
                this.makeMostRecentlyUsed(offsetNode)
                return offsetNode.value.data
            }

            const data = readFromDB(offset, size)
            const newNode = { offset, data }
            this.addNodeToCache(newNode)
            return data
        } catch(err) {
            console.log(err)
        }
    }
}

module.exports = { Cache }