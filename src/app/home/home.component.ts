import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../form/form.component';
import { UserService } from '../user.service';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  users: any[] = [];
  displayedColumns: string[] = ['name', 'cep', 'delete']; //'actions removed'
  dataSource!: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<User>(this.userService.getUsers());
    this.dataSource.paginator = this.paginator;

  }

  editUser(user: User) {
    this.router.navigate(['/form-component'], { queryParams: { id: user.id } });
  }
  
  deleteUser(user: User) {
    this.userService.deleteUser(user.id);
    this.dataSource.data = this.userService.getUsers();
  }
}

