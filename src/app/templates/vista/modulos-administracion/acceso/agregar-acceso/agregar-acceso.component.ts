import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Acceso } from 'src/app/models/acceso';
import { AccesoService } from 'src/app/services/acceso.service';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { ModuloService } from 'src/app/services/modulo.service';
import { RolService } from 'src/app/services/rol.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-acceso',
  templateUrl: './agregar-acceso.component.html',
  styleUrls: ['./agregar-acceso.component.css']
})
export class AgregarAccesoComponent {
  public formAcceso!: FormGroup;
  public listaRoles: any = [];
  public listaModulos: any = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AgregarAccesoComponent>,
    private servicioAcceso: AccesoService,
    private servicioRol: RolService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioModulo: ModuloService
  ) { }


  ngOnInit(): void {
    this.crearFormulario();
    this.listarRoles();
    this.listarModulos();
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

  public guardar() {
    if(this.formAcceso.valid){
      document.getElementById('snipperAgregarAcceso')?.setAttribute('style', 'display: block;')
      this.servicioConsultasGenerales.listarAccesos().subscribe(resAccesos=>{
        var existeAcceso = resAccesos.filter(acceso=>acceso.idModulo == this.formAcceso.value.modulo.id && acceso.idRol == this.formAcceso.value.rol.id)
        if(existeAcceso.length > 0){
          document.getElementById('snipperAgregarAcceso')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ese acceso ya lo tiene el rol!',
            showConfirmButton: false,
            timer: 1500
          })
        }else{
          this.servicioRol.listarPorId(this.formAcceso.value.rol).subscribe(resRolIde=>{
            let accesoRegistrar : Acceso = new Acceso();
            accesoRegistrar.idModulo = this.formAcceso.value.modulo;
            accesoRegistrar.idRol = resRolIde
            this.registrarAcceso(accesoRegistrar);
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

  public registrarAcceso(accesoRegistrar: Acceso) {
    this.servicioAcceso.registrar(accesoRegistrar).subscribe(res=>{
      document.getElementById('snipperAgregarAcceso')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Acceso Registrado!',
        showConfirmButton: false,
        timer: 1500
      })
      this.dialogRef.close();
      location.reload();
    }, error => {
      document.getElementById('snipperAgregarAcceso')?.setAttribute('style', 'display: none;')
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
