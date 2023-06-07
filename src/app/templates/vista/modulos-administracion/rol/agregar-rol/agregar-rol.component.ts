import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RolService } from 'src/app/services/rol.service';
import { Rol } from 'src/app/models/rol';
import { EstadoService } from 'src/app/services/estado.service';

@Component({
  selector: 'app-agregar-rol',
  templateUrl: './agregar-rol.component.html',
  styleUrls: ['./agregar-rol.component.css']
})
export class AgregarRolComponent {

  public formRol!: FormGroup;
  public listaRolesC: any = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AgregarRolComponent>,
    private servicioRol: RolService,
    private servicioEstado: EstadoService,
    @Inject(MAT_DIALOG_DATA) public listaRoles: MatDialog,
  ) { }


  ngOnInit(): void {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.formRol = this.fb.group({
      id: 0,
      descripcion: [null,Validators.required],
    });
  }

  public guardar() {
    this.listaRolesC = this.listaRoles
    if(this.formRol.valid){
      document.getElementById('snipperAgregarRol')?.setAttribute('style', 'display: block;')
      var existeRoles = this.listaRolesC.filter((rol: any)=>rol.descripcion.toUpperCase() == this.formRol.controls['descripcion'].value.toUpperCase())
      if(existeRoles.length > 0){
        if(existeRoles[0].idEstado.id == 4){
          document.getElementById('snipperAgregarRol')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ese rol ya existe!',
            showConfirmButton: false,
            timer: 1500
          })
        }else{
          document.getElementById('snipperAgregarRol')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ese rol ya existe, solo que esta inactivo!',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }else{
        this.servicioEstado.listarPorId(4).subscribe(resEstadoRolActivo=>{
          let rol : Rol = new Rol();
          rol.descripcion = this.formRol.value.descripcion.toUpperCase();
          rol.idEstado = resEstadoRolActivo;
          this.registrarRol(rol);
        })
      }
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

  public registrarRol(rol: Rol) {
    this.servicioRol.registrar(rol).subscribe(res=>{
      document.getElementById('snipperAgregarRol')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Rol Registrado!',
        showConfirmButton: false,
        timer: 1500
      })
      this.dialogRef.close();
      location.reload();
    }, error => {
      document.getElementById('snipperAgregarRol')?.setAttribute('style', 'display: none;')
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
