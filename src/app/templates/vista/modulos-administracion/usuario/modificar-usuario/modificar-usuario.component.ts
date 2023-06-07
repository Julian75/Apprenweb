import CryptoJS from 'crypto-js';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario';
import { EstadoService } from 'src/app/services/estado.service';
import { RolService } from 'src/app/services/rol.service';
import { TipoDocumentoService } from 'src/app/services/tipoDocumento.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UsuarioModificar } from 'src/app/models-actualizar/usuarioModificar';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { ModificarService } from 'src/app/services/modificar.service';

@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.component.html',
  styleUrls: ['./modificar-usuario.component.css']
})
export class ModificarUsuarioComponent {

  public formUsuario!: FormGroup;
  public listaTiposDocumentos: any = [];
  public listaRoles: any = [];
  public listaEstados: any = [];
  public listaUsuarioIde: any = [];

  constructor(
    private fb: FormBuilder,
    private servicioUsuario: UsuarioService,
    private route: ActivatedRoute,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioModificar: ModificarService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.listarTiposDocumentos();
    this.listarRoles();
    this.listarEstados();
    this.listarUsuarioIde();
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
      estado: [null,Validators.required]
    });
  }

  private listarTiposDocumentos(){
    this.servicioConsultasGenerales.listarTipoDocumentoActivos().subscribe(resTiposDocumentos=>{
      console.log(resTiposDocumentos)
      this.listaTiposDocumentos = resTiposDocumentos
    })
  }

  private listarRoles(){
    this.servicioConsultasGenerales.listarRoles(1).subscribe(resRoles=>{
      this.listaRoles = resRoles
    })
  }

  private listarEstados(){
    this.servicioConsultasGenerales.listarEstadosIdModulo(5).subscribe(resEstados=>{
      this.listaEstados = resEstados
    })
  }

  private listarUsuarioIde(){
    this.route.paramMap.subscribe((params: ParamMap) => {
      var idCapturadoUrl = params.get('id')
      this.servicioUsuario.listarPorId(Number(idCapturadoUrl)).subscribe(resUsuarioIde=>{
        this.listaUsuarioIde = resUsuarioIde
        this.formUsuario.controls['id'].setValue(this.listaUsuarioIde.id);
        this.formUsuario.controls['nombre'].setValue(this.listaUsuarioIde.nombre);
        this.formUsuario.controls['apellido'].setValue(this.listaUsuarioIde.apellido);
        this.formUsuario.controls['correo'].setValue(this.listaUsuarioIde.correo);
        this.formUsuario.controls['tipoDocumento'].setValue(this.listaUsuarioIde.idTipoDocumento.id);
        this.formUsuario.controls['documento'].setValue(this.listaUsuarioIde.documento);
        this.formUsuario.controls['rol'].setValue(this.listaUsuarioIde.idRol.id);
        this.formUsuario.controls['estado'].setValue(this.listaUsuarioIde.idEstado.id);
        const contrasena = this.listaUsuarioIde.password.toString()
        var bytes  = CryptoJS.AES.decrypt(contrasena, 'secret key 123');
        var decryptedData = JSON.stringify(bytes.toString(CryptoJS.enc.Utf8));
        var contrasenaDesencrip = decryptedData.slice(3, -3)
        this.formUsuario.controls['password'].setValue(contrasenaDesencrip);
      })
    })
  }

  public guardar() {
    console.log(this.formUsuario.value.password)
    if(this.formUsuario.valid){
      document.getElementById('snipperModificarUsuario')?.setAttribute('style', 'display: block;')
      this.servicioUsuario.listarTodos().subscribe(resUsuarios=>{
        var igualUsuario = resUsuarios.filter(usuario=>usuario.id == this.listaUsuarioIde.id && usuario.documento == this.formUsuario.value.documento && usuario.nombre.toUpperCase() == this.formUsuario.value.nombre.toUpperCase() && usuario.apellido.toUpperCase() == this.formUsuario.value.apellido.toUpperCase() && usuario.correo == this.formUsuario.value.correo && usuario.idTipoDocumento.id == this.formUsuario.value.tipoDocumento && usuario.idRol.id == this.formUsuario.value.rol && usuario.idEstado.id == this.formUsuario.value.estado)
        var existeUsuario = resUsuarios.filter(usuario=>usuario.id != this.listaUsuarioIde.id && usuario.documento == this.formUsuario.value.documento)
        if(igualUsuario.length > 0){
          document.getElementById('snipperModificarUsuario')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'No hubieron cambios!',
              showConfirmButton: false,
              timer: 1500
            })
        }else if(existeUsuario.length > 0){
          if(existeUsuario[0].idEstado.id == 6){
            document.getElementById('snipperModificarUsuario')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Ya existe un usuario con ese número de documento!',
              showConfirmButton: false,
              timer: 1500
            })
          }else{
            document.getElementById('snipperModificarUsuario')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Ya existe un usuario con ese número de documento, solo que esta inactivo!',
              showConfirmButton: false,
              timer: 1500
            })
          }
        }else{
          let usuarioModificar : UsuarioModificar = new UsuarioModificar();
          usuarioModificar.id = this.listaUsuarioIde.id
          usuarioModificar.nombre = this.formUsuario.value.nombre.toUpperCase()
          usuarioModificar.apellido = this.formUsuario.value.apellido.toUpperCase()
          usuarioModificar.correo = this.formUsuario.value.correo
          usuarioModificar.documento = this.formUsuario.value.documento
          usuarioModificar.idTipoDocumento = this.formUsuario.value.tipoDocumento
          usuarioModificar.idRol = this.formUsuario.value.rol
          usuarioModificar.idEstado = this.formUsuario.value.estado
          usuarioModificar.password = CryptoJS.AES.encrypt(JSON.stringify(this.formUsuario.value.password), 'secret key 123').toString();
          this.modificarUsuario(usuarioModificar);
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

  public modificarUsuario(usuarioModificar: UsuarioModificar) {
    this.servicioModificar.actualizarUsuario(usuarioModificar).subscribe(res=>{
      document.getElementById('snipperModificarUsuario')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Usuario Modificado!',
        showConfirmButton: false,
        timer: 1500
      })
      location.reload();
      this.router.navigate(['/vista/usuario']);
    }, error => {
      document.getElementById('snipperModificarUsuario')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Hubo un error al modificar!',
        showConfirmButton: false,
        timer: 1500
      })
    });
  }
}
