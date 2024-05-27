package model

import (
	"fmt"
)

type LinkedList struct {
	Head *Node
}

func (l *LinkedList) Add(val int) {
	newNode := &Node{Val: val}
	if l.Head == nil {
		l.Head = newNode
		return
	}

	current := l.Head
	for current.Next != nil {
		current = current.Next
	}
	current.Next = newNode
}

func (l *LinkedList) Show() {
	current := l.Head
	for current != nil {
		fmt.Print(current.Val, " -> ")
		current = current.Next
	}

	fmt.Println("nil")
}

func (l *LinkedList) Len() int {
	len := 0
	current := l.Head

	if l.Head == nil {
		return 0
	}

	for current.Next != nil {
		len += 1
		current = current.Next
	}

	return len + 1
}

func (l *LinkedList) Swap() {
	arrNode := []Node{} // Chuyển hết các phần của list vào đây
	current := l.Head
	for current.Next != nil {
		arrNode = append(arrNode, *current)
		current = current.Next
	}
	arrNode = append(arrNode, *current)

	lenghtArrNode := len(arrNode)
	l.Head = &arrNode[0]
	current = l.Head
	for i := 0; i < lenghtArrNode-1; i++ {
		if i >= lenghtArrNode/2 {
			if lenghtArrNode%2 == 1 {
				current.Next = &arrNode[i]
				current = &arrNode[i]
			}
			break
		}
		if arrNode[i].Next == arrNode[lenghtArrNode-1-i].Next {
			current.Next = &arrNode[i]
			current = &arrNode[i]
			continue
		}

		current.Next = &arrNode[i]
		current = &arrNode[i]

		current.Next = &arrNode[lenghtArrNode-1-i]
		current = &arrNode[lenghtArrNode-1-i]
	}

	current.Next = nil
}
