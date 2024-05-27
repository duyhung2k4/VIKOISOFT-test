package test

import (
	"app/model"
	"fmt"
)

type TestLinkedList struct{}

func (t *TestLinkedList) EvenLinkedList() {
	list := model.LinkedList{}
	list.Add(1)
	list.Add(2)
	list.Add(3)
	list.Add(4)
	list.Add(5)
	list.Add(6)

	fmt.Println("Even linked list: ")
	list.Show()
	list.Swap()
	list.Show()
}

func (t *TestLinkedList) OddLinkedList() {
	list := model.LinkedList{}
	list.Add(1)
	list.Add(2)
	list.Add(3)
	list.Add(4)
	list.Add(5)
	list.Add(6)
	list.Add(7)

	fmt.Println("Odd linked list: ")
	list.Show()
	list.Swap()
	list.Show()
}
