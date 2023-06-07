import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ModuloService } from 'src/app/services/modulo.service';
import { ModuloModificar } from 'src/app/models-actualizar/moduloModificar';
import { ModificarService } from 'src/app/services/modificar.service';

@Component({
  selector: 'app-modificar-modulo',
  templateUrl: './modificar-modulo.component.html',
  styleUrls: ['./modificar-modulo.component.css']
})
export class ModificarModuloComponent {

  public formModulo!: FormGroup;
  public listaModulos: any = [];  // lista de modulos

  constructor(
    private servicioModulo: ModuloService,
    private servicioModificar: ModificarService,
    public dialogRef: MatDialogRef<ModificarModuloComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public moduloIde: MatDialog,
  ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.listarporidModulo();
  }

  private crearFormulario() {
    this.formModulo = this.fb.group({
      id: [''],
      descripcion: [null,Validators.required],
    });
  }

  public listarporidModulo() {
    this.listaModulos = this.moduloIde
    this.formModulo.controls['id'].setValue(this.listaModulos[0].id);
    this.formModulo.controls['descripcion'].setValue(this.listaModulos[0].descripcion);
  }

  public guardar() {
    if(this.formModulo.valid){
      document.getElementById('snipperModificarModulo')?.setAttribute('style', 'display: block;')
      var existeModulo = this.listaModulos[1].filter((modulo: any)=> modulo.id != this.listaModulos[0].id && modulo.descripcion.toUpperCase() == this.formModulo.value.descripcion.toUpperCase())
      var sinCambioModulo = this.listaModulos[1].filter((modulo: any)=> modulo.id == this.listaModulos[0].id && modulo.descripcion.toUpperCase() == this.formModulo.value.descripcion.toUpperCase())
      if(sinCambioModulo.length > 0){
        document.getElementById('snipperModificarModulo')?.setAttribute('style', 'display: none;')
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'No hubieron cambios!',
          showConfirmButton: false,
          timer: 1500
        })
        this.dialogRef.close();
      }else if(existeModulo.length > 0){
        document.getElementById('snipperModificarModulo')?.setAttribute('style', 'display: none;')
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Ya existe ese modulo!',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        let moduloModificar : ModuloModificar = new ModuloModificar();
        moduloModificar.id = Number(this.listaModulos[0].id);
        moduloModificar.descripcion = this.formModulo.value.descripcion.toUpperCase();
        this.actualizarModulo(moduloModificar)
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

  public actualizarModulo(moduloModificar: ModuloModificar) {
    this.servicioModificar.actualizarModulo(moduloModificar).subscribe(res => {
      document.getElementById('snipperModificarModulo')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Modulo modificado!',
        showConfirmButton: false,
        timer: 1500
      })
      this.dialogRef.close();
      location.reload();
    }, error => {
      document.getElementById('snipperModificarModulo')?.setAttribute('style', 'display: none;')
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
