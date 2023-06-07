import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  public usuario:any =[]
  public idRolUsuario = 0;
  public diferente: any = false;

  constructor(
    private router: Router,
    private servicioUsuario: UsuarioService,
    private sharedService:SharedService
  ) { }

  ngOnInit(): void {
    this.servicioUsuario.listarPorId(Number(sessionStorage.getItem('id'))).subscribe(resUsuario=>{
      this.idRolUsuario = resUsuario.idRol.id
      if(document.location.href != this.sharedService.direccionUrl+"vista" && document.location.href != this.sharedService.direccionUrl+"vista/categoriasEstudiante"){
        this.diferente = true
      };

      // if(this.idRolUsuario != 2){
      //   document.getElementById('navAdministracion')?.setAttribute('style', 'display: block;')
      // }
    })
  }

  public salir(){
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('usuario');
    this.router.navigate(['/']);
  }

  public abrirAsignaturas(){
    this.router.navigate(['/vista/categoriasEstudiante']);
    setTimeout(()=>{
      location.reload()
    }, 500)
  }

  public abrirVista(){
    this.router.navigate(['/vista']);
    setTimeout(()=>{
      location.reload()
    }, 500)
  }
}
