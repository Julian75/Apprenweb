import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  panelOpenState = false;
  idRolUsuario = 0;

  constructor(
    private servicioUsuario: UsuarioService,
    private router: Router,
  ){}

  ngOnInit(): void {
    this.servicioUsuario.listarPorId(Number(sessionStorage.getItem('id'))).subscribe(resUsuario=>{
      this.idRolUsuario = resUsuario.idRol.id
      // if(this.idRolUsuario != 2){
      //   document.getElementById('conte')?.setAttribute('style', 'display: block;')
      // }
    })
  }

}
