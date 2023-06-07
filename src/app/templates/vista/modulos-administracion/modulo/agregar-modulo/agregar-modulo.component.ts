import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ModuloService } from 'src/app/services/modulo.service';
import { Modulo } from 'src/app/models/modulo';

@Component({
  selector: 'app-agregar-modulo',
  templateUrl: './agregar-modulo.component.html',
  styleUrls: ['./agregar-modulo.component.css']
})
export class AgregarModuloComponent {

  public formModulo!: FormGroup;
  public listaModuloRes: any = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AgregarModuloComponent>,
    private servicioModulo: ModuloService,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog,
  ) { }

  ngOnInit(): void {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.formModulo = this.fb.group({
      id: 0,
      descripcion: [null,Validators.required],
    });
  }
  public guardar() {
    if(this.formModulo.valid){
      this.listaModuloRes = this.data
      document.getElementById('snipperAgregarModulo')?.setAttribute('style', 'display: block;')
      var existeModulo = this.listaModuloRes.filter((modulo:any)=> modulo.descripcion.toUpperCase() == this.formModulo.value.descripcion.toUpperCase())
      if(existeModulo.length > 0){
        document.getElementById('snipperAgregarModulo')?.setAttribute('style', 'display: none;')
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Ya existe ese modulo!',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        let moduloRegistrar : Modulo = new Modulo();
        moduloRegistrar.descripcion = this.formModulo.controls['descripcion'].value.toUpperCase();
        this.registrarModulo(moduloRegistrar)
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

  public registrarModulo(modulo: Modulo) {
    this.servicioModulo.registrar(modulo).subscribe(res=>{
      document.getElementById('snipperAgregarModulo')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Modulo Registrado!',
        showConfirmButton: false,
        timer: 1500
      })
      this.dialogRef.close();
      window.location.reload();
    }, error => {
      document.getElementById('snipperAgregarModulo')?.setAttribute('style', 'display: none;')
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
