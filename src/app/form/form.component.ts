import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';

export interface User {
  id: number;
  nome: string;
  cep: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento?: string;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  myForm!: FormGroup;
  users: User[] = [];
  user!: User;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.queryParams['id'];
    if (id) {
      const user = this.userService.getUserById(id);
      if (user) {
      this.user = user;     
      this.myForm.setValue({
        nome: this.user.nome,
        cep: this.user.cep,
        cidade: this.user.cidade,
        bairro: this.user.bairro,
        logradouro: this.user.logradouro,
        numero: this.user.numero,
        complemento: this.user.complemento
      });
    }
  }
    else{
    this.myForm = this.fb.group({      
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      cidade: ['', Validators.required],
      bairro: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: ['']
    });
  }
  }

  onCepBlur() {
    const cepValue = this.myForm.controls['cep'].value;
    if (cepValue) {
      const cepDigits = cepValue.replace(/\D/g, '');
      if (cepDigits.length === 8) {
        this.fetchAddressByCep(cepDigits);
      }
    }
  }

  fetchAddressByCep(cep: string) {
    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;

    this.http.get(apiUrl).subscribe((data: any) => {
      console.log(data); // Display the address data in the console
      // Set the values of the address fields in the form
      this.myForm.patchValue({
        cidade: data.localidade,
        bairro: data.bairro,
        logradouro: data.logradouro,
        complemento: data.complemento
      });
    }, (error) => {
      console.log(error); // Display any errors in the console
    });
  }


  onSubmit() {
    if (this.myForm.valid) {
      const user: User = this.myForm.value;
      this.userService.addUser(user);      
      this.router.navigate(['/home-component']); // navigate to another page
    }
  }
}
