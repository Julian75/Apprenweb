import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AccesoModificar } from 'src/app/models-actualizar/accesoModificar';
import { AccesoService } from 'src/app/services/acceso.service';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { ModificarService } from 'src/app/services/modificar.service';
import { ModuloService } from 'src/app/services/modulo.service';
import { RolService } from 'src/app/services/rol.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-acceso',
  templateUrl: './modificar-acceso.component.html',
  styleUrls: ['./modificar-acceso.component.css']
})
export class ModificarAccesoComponent {
  public formAcceso!: FormGroup;
  public listaRoles: any = [];
  public listaModulos: any = [];
  public listarAcceso: any = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModificarAccesoComponent>,
    private servicioAcceso: AccesoService,
    private servicioModificar: ModificarService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioModulo: ModuloService,
    @Inject(MAT_DIALOG_DATA) public acceso: MatDialog,
  ) { }


  ngOnInit(): void {
    this.crearFormulario();
    this.listarRoles();
    this.listarModulos();
    this.listarporidAcceso();
  }

  private crearFormulario() {
    this.formAcceso = this.fb.group({
      id: 0,
      rol: [null,Validators.required],
      modulo: [null,Validators.required],
    });
  }

  private listarRoles(){
    this.servicioConsultasGenerales.listarRoles(1).subscribe(resRoles=>{
      this.listaRoles = resRoles
    })
  }

  private listarModulos(){
    this.servicioModulo.listarTodos().subscribe(resModulos=>{
      this.listaModulos = resModulos
    })
  }

  public listarporidAcceso() {
    this.listarAcceso = this.acceso;
    this.formAcceso.controls['id'].setValue(this.listarAcceso.id);
    this.formAcceso.controls['rol'].setValue(this.listarAcceso.idRol.id);
    this.formAcceso.controls['modulo'].setValue(this.listarAcceso.idModulo.id);
  }

  public guardar() {
    if(this.formAcceso.valid){
      document.getElementById('snipperModificarAcceso')?.setAttribute('style', 'display: block;')
      this.servicioConsultasGenerales.listarAccesos().subscribe(resAccesos=>{
        var sinCambioAcceso = resAccesos.filter(acceso=>acceso.id == this.listarAcceso.id && acceso.idModulo == this.formAcceso.value.modulo && acceso.idRol == this.formAcceso.value.rol)
        var existeAcceso = resAccesos.filter(acceso=>acceso.id != this.listarAcceso.id && acceso.idModulo == this.formAcceso.value.modulo && acceso.idRol == this.formAcceso.value.rol)
        if(sinCambioAcceso.length > 0){
          document.getElementById('snipperModificarAcceso')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'No hubieron cambios!',
            showConfirmButton: false,
            timer: 1500
          })
        }else if(existeAcceso.length > 0){
          document.getElementById('snipperModificarAcceso')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ese acceso ya lo tiene el rol!',
            showConfirmButton: false,
            timer: 1500
          })
        }else{
          let accesoModificar : AccesoModificar = new AccesoModificar();
          accesoModificar.id = this.listarAcceso.id
          accesoModificar.idModulo = this.formAcceso.value.modulo;
          accesoModificar.idRol = this.formAcceso.value.rol
          this.actualizarAcceso(accesoModificar);
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

  public actualizarAcceso(accesoModificar: AccesoModificar) {
    this.servicioModificar.actualizarAcceso(accesoModificar).subscribe(res=>{
      document.getElementById('snipperModificarAcceso')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Acceso Actualizado!',
        showConfirmButton: false,
        timer: 1500
      })
      this.dialogRef.close();
      location.reload();
    }, error => {
      document.getElementById('snipperModificarAcceso')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Hubo un error al actualizar!',
        showConfirmButton: false,
        timer: 1500
      })
    });
  }
}
