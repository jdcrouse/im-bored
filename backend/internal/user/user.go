package user

import "log"

type User struct {
	Name string
}

func (u *User) Notify() {
	log.Printf("%s notified", u.Name)
}
