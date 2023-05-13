    //base doublyLinkedList code copied from: https://www.30secondsofcode.org/articles/s/js-data-structures-doubly-linked-list/#:~:text=A%20doubly%20linked%20list%20is,last%20element%20is%20the%20tail.

class DoublyLinkedList {
    constructor() {
        this.nodes = [];
    }

    get size() {
        return this.nodes.length;
    }

    get head() {
        return this.size ? this.nodes[0] : null;
    }

    get tail() {
        return this.size ? this.nodes[this.size - 1] : null;
    }

    insertAt(index, value) {
        const previousNode = this.nodes[index - 1] || null;
        const nextNode = this.nodes[index] || null;
        const node = { value, next: nextNode, previous: previousNode };

        if (previousNode) previousNode.next = node;
        if (nextNode) nextNode.previous = node;
        this.nodes.splice(index, 0, node);
    }

    insertFirst(value) {
        this.insertAt(0, value);
    }

    insertLast(value) {
        this.insertAt(this.size, value);
    }

    getAt(index) {
        return this.nodes[index];
    }    

    removeAt(index) {
        const previousNode = this.nodes[index - 1] || null;
        const nextNode = this.nodes[index + 1] || null;

        if (previousNode) previousNode.next = nextNode;
        if (nextNode) nextNode.previous = previousNode;

        return this.nodes.splice(index, 1);
    }

    removeLast() {
        this.removeAt(this.nodes.length - 1)
    }    

    remove(value) {
        const index = this.nodes.findIndex((node) => {
            return node.value === value
        })
        this.removeAt(index)
    }

    clear() {
        this.nodes = [];
    }

    reverse() {
        this.nodes = this.nodes.reduce((acc, { value }) => {
        const nextNode = acc[0] || null;
        const node = { value, next: nextNode, previous: null };
        if (nextNode) nextNode.previous = node;
        return [node, ...acc];
        }, []);
    }

    *[Symbol.iterator]() {
        yield* this.nodes;
    }
}

module.exports = { DoublyLinkedList }