import CryptoJS from 'crypto-js';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario';
import { EstadoService } from 'src/app/services/estado.service';
import { RolService } from 'src/app/services/rol.service';
import { TipoDocumentoService } from 'src/app/services/tipoDocumento.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';

@Component({
  selector: 'app-agregar-usuario',
  templateUrl: './agregar-usuario.component.html',
  styleUrls: ['./agregar-usuario.component.css']
})
export class AgregarUsuarioComponent {

  public formUsuario!: FormGroup;
  public listaTiposDocumentos: any = [];
  public listaRoles: any = [];

  constructor(
    private fb: FormBuilder,
    private servicioTipoDocumento: TipoDocumentoService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioRol: RolService,
    private servicioEstado: EstadoService,
    private servicioUsuario: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.listarTiposDocumentos();
    this.listarRoles();
  }

  private crearFormulario() {
    this.formUsuario = this.fb.group({
      id: 0,
      nombre: [null,Validators.required],
      apellido: [null,Validators.required],
      correo: [null,Validators.required],
      tipoDocumento: [null,Validators.required],
      documento: [null,Validators.required],
      password: [null,Validators.required],
      rol: [null,Validators.required],
    });
  }

  private listarTiposDocumentos(){
    this.servicioConsultasGenerales.listarTipoDocumentoActivos().subscribe(resTiposDocumentos=>{
      this.listaTiposDocumentos = resTiposDocumentos
    })
  }

  private listarRoles(){
    this.servicioConsultasGenerales.listarRoles(1).subscribe(resRoles=>{
      this.listaRoles = resRoles
    })
  }

  public guardar() {
    if(this.formUsuario.valid){
      document.getElementById('snipperAgregarUsuario')?.setAttribute('style', 'display: block;')
      this.servicioUsuario.listarTodos().subscribe(resUsuarios=>{
        var existeUsuario = resUsuarios.filter(usuario=>usuario.documento == this.formUsuario.value.documento)
        if(existeUsuario.length > 0){
          if(existeUsuario[0].idEstado.id == 6){
            document.getElementById('snipperAgregarUsuario')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Ya existe un usuario con ese número de documento!',
              showConfirmButton: false,
              timer: 1500
            })
          }else{
            document.getElementById('snipperAgregarUsuario')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Ya existe un usuario con ese número de documento, solo que esta inactivo!',
              showConfirmButton: false,
              timer: 1500
            })
          }
        }else{
          this.servicioEstado.listarPorId(6).subscribe(resEstadoUsuarioActivo=>{
            this.servicioRol.listarPorId(this.formUsuario.value.rol.id).subscribe(resRolIde=>{
              this.servicioTipoDocumento.listarPorId(this.formUsuario.value.tipoDocumento.id).subscribe(resTipoDocumentIde=>{
                let usuarioRegistrar : Usuario = new Usuario();
                usuarioRegistrar.nombre = this.formUsuario.value.nombre.toUpperCase()
                usuarioRegistrar.apellido = this.formUsuario.value.apellido.toUpperCase()
                usuarioRegistrar.correo = this.formUsuario.value.correo
                usuarioRegistrar.documento = this.formUsuario.value.documento
                usuarioRegistrar.idTipoDocumento = resTipoDocumentIde
                usuarioRegistrar.idRol = resRolIde
                usuarioRegistrar.idEstado = resEstadoUsuarioActivo
                usuarioRegistrar.password = CryptoJS.AES.encrypt(JSON.stringify(this.formUsuario.value.password), 'secret key 123').toString();
                this.registrarUsuario(usuarioRegistrar);
              })
            })
          })
        }
      })
    }else{
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'El campo esta vacio!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  public registrarUsuario(usuarioRegistrar: Usuario) {
    this.servicioUsuario.registrar(usuarioRegistrar).subscribe(res=>{
      document.getElementById('snipperAgregarUsuario')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Usuario Registrado!',
        showConfirmButton: false,
        timer: 1500
      })
      location.reload();
      this.router.navigate(['/vista/usuario']);
    }, error => {
      document.getElementById('snipperAgregarUsuario')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Hubo un error al agregar!',
        showConfirmButton: false,
        timer: 1500
      })
    });
  }
}
