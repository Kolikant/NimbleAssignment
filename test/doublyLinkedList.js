const { DoublyLinkedList } = require("../src/doublyLinkedList")

describe('doublyLinkedList', () => {

    test("remove last node", () => {
        let doublyLinkedList = new DoublyLinkedList();
        expect(doublyLinkedList.nodes.length).toBe(0)
        doublyLinkedList.removeAt(0)
        expect(doublyLinkedList.nodes.length).toBe(0)
    })

    test("remove at random index", () => {
        let doublyLinkedList = new DoublyLinkedList();
        doublyLinkedList.insertLast(5)
        doublyLinkedList.insertLast(6)
        doublyLinkedList.insertLast(7)
        
        expect(doublyLinkedList.nodes.length).toBe(3)
        expect(doublyLinkedList.getAt(0).value).toBe(5)
        expect(doublyLinkedList.getAt(1).value).toBe(6)
        expect(doublyLinkedList.getAt(2).value).toBe(7)

        doublyLinkedList.remove(6)
        
        expect(doublyLinkedList.nodes.length).toBe(2)
        expect(doublyLinkedList.getAt(0).value).toBe(5)
        expect(doublyLinkedList.getAt(1).value).toBe(7)
    })    
})