import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RolModificar } from 'src/app/models-actualizar/rolModificar';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { EstadoService } from 'src/app/services/estado.service';
import { ModificarService } from 'src/app/services/modificar.service';
import { RolService } from 'src/app/services/rol.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-rol',
  templateUrl: './modificar-rol.component.html',
  styleUrls: ['./modificar-rol.component.css']
})
export class ModificarRolComponent {

  public formRol!: FormGroup;
  public listaEstados: any = [];
  public listaRolIde: any = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModificarRolComponent>,
    private servicioModificar : ModificarService,
    private servicioConsultasGenerales : ConsultasGeneralesService,
    private servicioRol : RolService,
    @Inject(MAT_DIALOG_DATA) public rol: MatDialog,
 ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.listarEstados();
    this.listarIdRol();
  }

  private crearFormulario() {
    this.formRol = this.fb.group({
      id: 0,
      descripcion: [null,Validators.required],
      estado: [null,Validators.required],
    });
  }

  public listarEstados() {
    this.servicioConsultasGenerales.listarEstadosIdModulo(4).subscribe(res => {
      this.listaEstados = res
    })
  }

  public listarIdRol() {
    this.listaRolIde = this.rol;
    this.formRol.controls['id'].setValue(this.listaRolIde[0].id);
    this.formRol.controls['descripcion'].setValue(this.listaRolIde[0].descripcion);
    this.formRol.controls['estado'].setValue(this.listaRolIde[0].idEstado.id);
  }

  public guardar() {
    if(this.formRol.valid){
      document.getElementById('snipperModificarRol')?.setAttribute('style', 'display: block;')
      var existeRol = this.listaRolIde[1].filter((rol:any)=> rol.id != this.listaRolIde[0].id && rol.descripcion.toUpperCase() == this.formRol.value.descripcion.toUpperCase())
      var igualRol = this.listaRolIde[1].filter((rol:any)=> rol.id == this.listaRolIde[0].id && rol.descripcion.toUpperCase() == this.formRol.value.descripcion.toUpperCase() && rol.idEstado.id == this.formRol.value.estado)
      if(igualRol.length > 0){
        document.getElementById('snipperModificarRol')?.setAttribute('style', 'display: none;')
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'No hubieron cambios!',
          showConfirmButton: false,
          timer: 1500
        })
        this.dialogRef.close()
      }else if(existeRol.length > 0){
        if(existeRol[0].idEstado.id == 4){
          document.getElementById('snipperModificarRol')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ya existe este rol!',
            showConfirmButton: false,
            timer: 1500
          })
        }else{
          document.getElementById('snipperModificarRol')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ya existe este rol, solo que esta inactivo!',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }else{
        let rolModificar : RolModificar = new RolModificar();
        rolModificar.id = this.listaRolIde[0].id
        rolModificar.descripcion = this.formRol.value.descripcion.toUpperCase()
        rolModificar.idEstado = this.formRol.value.estado
        this.actualizarRol(rolModificar)
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

  private actualizarRol(rolModificar :RolModificar){
    this.servicioModificar.actualizarRol(rolModificar).subscribe(res => {
      document.getElementById('snipperModificarRol')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Rol modificado!',
        showConfirmButton: false,
        timer: 1500
      })
      this.dialogRef.close();
      location.reload();
    }, error => {
      document.getElementById('snipperModificarRol')?.setAttribute('style', 'display: none;')
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
