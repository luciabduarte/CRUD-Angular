import { Injectable } from '@angular/core';
import { User } from './form/form.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];

  constructor() { }

  addUser(user: User) {
    user.id = this.users.length;
    this.users.push(user);
  }

  getUsers() {
    return this.users;
  }

  getUserById(id: number): User| undefined {    
    return this.users.find(user => user.id === id);
  }  

  deleteUser(id: number){
    this.users.splice(id, 1);
  }
}
