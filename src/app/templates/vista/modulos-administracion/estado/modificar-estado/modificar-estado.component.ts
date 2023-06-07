import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { AgregarEstadoComponent } from '../agregar-estado/agregar-estado.component';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ModuloService } from 'src/app/services/modulo.service';
import { EstadoService } from 'src/app/services/estado.service';
import { Estado } from 'src/app/models/estado';
import { EstadoModificar } from 'src/app/models-actualizar/estadoModificar';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { ModificarService } from 'src/app/services/modificar.service';
@Component({
  selector: 'app-modificar-estado',
  templateUrl: './modificar-estado.component.html',
  styleUrls: ['./modificar-estado.component.css']
})
export class ModificarEstadoComponent implements OnInit {
   public formEstado!: FormGroup;
   public idEstado : any;
   public listarEstado: any = [];
   public listarModulo: any = [];
   color = ('primary');
  constructor(
     private fb: FormBuilder,
     private servicioModulo: ModuloService,
     public dialogRef: MatDialogRef<AgregarEstadoComponent>,
     private servicioEstado : EstadoService,
     private servicioModificar : ModificarService,
     private servicioConsultasGenerales : ConsultasGeneralesService,
     private route: ActivatedRoute,
     @Inject(MAT_DIALOG_DATA) public estado: MatDialog,
  ) { }

  ngOnInit(): void {this.crearFormulario();
    this.listarporidEstado();
    this.listaModulo();
  }

  private crearFormulario() {
    this.formEstado = this.fb.group({
      id: [''],
      descripcion: [null,Validators.required],
      observacion: [null,Validators.required],
      modulo: [null,Validators.required],
    });
  }

  public listaModulo() {
    this.servicioModulo.listarTodos().subscribe(res => {
      this.listarModulo = res;
  });}

  public listarporidEstado() {
    this.listarEstado = this.estado;
    this.formEstado.controls['id'].setValue(this.listarEstado.id);
    this.formEstado.controls['descripcion'].setValue(this.listarEstado.descripcion);
    this.formEstado.controls['observacion'].setValue(this.listarEstado.observacion);
    this.formEstado.controls['modulo'].setValue(this.listarEstado.idModulo.id);
  }

  public guardar() {
    if(this.formEstado.valid){
      document.getElementById('snipperModificarEstado')?.setAttribute('style', 'display: block;')
      this.servicioConsultasGenerales.listarEstados().subscribe(res =>{
        var existeEstado = res.filter(estado=>estado.id != this.listarEstado.id && estado.descripcion.toUpperCase() == this.formEstado.value.descripcion.toUpperCase() && estado.idModulo == this.formEstado.value.modulo)
        var sinCambiosEstado = res.filter(estado=>estado.id == this.listarEstado.id && estado.descripcion.toUpperCase() == this.formEstado.value.descripcion.toUpperCase() && estado.idModulo == this.formEstado.value.modulo && estado.observacion.toUpperCase() == this.formEstado.value.observacion.toUpperCase())
        console.log(sinCambiosEstado, this.listarEstado, this.formEstado.value)
        if(sinCambiosEstado.length > 0){
          document.getElementById('snipperModificarEstado')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'No hubieron cambios!',
            showConfirmButton: false,
            timer: 1500
          })
          this.dialogRef.close();
        }else if(existeEstado.length > 0){
          document.getElementById('snipperModificarEstado')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ya existe ese estado para ese modulo!',
            showConfirmButton: false,
            timer: 1500
          })
        }else{
          let estadoModificar : EstadoModificar = new EstadoModificar();
          estadoModificar.id = Number(this.listarEstado.id);
          estadoModificar.descripcion = this.formEstado.controls['descripcion'].value.toUpperCase();
          estadoModificar.observacion = this.formEstado.controls['observacion'].value.toUpperCase();
          estadoModificar.idModulo = this.formEstado.controls['modulo'].value
          this.actualizarEstado(estadoModificar);
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

  public actualizarEstado(estadoModificar: EstadoModificar) {
    this.servicioModificar.actualizarEstado(estadoModificar).subscribe(res=>{
      document.getElementById('snipperModificarEstado')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Estado Modificado!',
        showConfirmButton: false,
        timer: 1500
      })
      this.dialogRef.close();
      location.reload();
    }, error => {
      document.getElementById('snipperModificarEstado')?.setAttribute('style', 'display: none;')
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
