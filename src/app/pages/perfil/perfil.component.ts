import { TOKEN_NAME } from './../../_shared/var.constant';
import { Component, OnInit } from '@angular/core';
import * as decode from 'jwt-decode';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: string;
  rol: string;
  imagen: string;

  constructor() { }

  ngOnInit() {
    let token = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
    const decodedToken = decode(token.access_token);
    this.usuario = decodedToken.user_name;
    this.rol = decodedToken.authorities[0];


    if (this.rol === 'ROLE_ADMIN') {
      this.imagen = 'https://images.pexels.com/photos/120222/pexels-photo-120222.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260';
    } else {
      this.imagen = 'https://images.pexels.com/photos/209679/pexels-photo-209679.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';
    }

  }

}
