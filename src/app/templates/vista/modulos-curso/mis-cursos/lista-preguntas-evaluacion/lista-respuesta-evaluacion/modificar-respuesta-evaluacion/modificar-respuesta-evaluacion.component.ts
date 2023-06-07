import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RespuestaEvaluacionModificar } from 'src/app/models-actualizar/respuestaEvaluacionModificar';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { EstadoService } from 'src/app/services/estado.service';
import { ModificarService } from 'src/app/services/modificar.service';
import { RespuestaEvaluacionService } from 'src/app/services/respuestaEvaluacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-respuesta-evaluacion',
  templateUrl: './modificar-respuesta-evaluacion.component.html',
  styleUrls: ['./modificar-respuesta-evaluacion.component.css']
})
export class ModificarRespuestaEvaluacionComponent {

  public formRespuesta!: FormGroup;
  public listaEstados: any = [];
  public listaRespuestaEvaluacion: any = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModificarRespuestaEvaluacionComponent>,
    private servicioEstado : EstadoService,
    private servicioRespuestaEvaluacion : RespuestaEvaluacionService,
    private servicioModificar : ModificarService,
    private servicioConsultasGenerales : ConsultasGeneralesService,
    @Inject(MAT_DIALOG_DATA) public preguntaEvaluacion: MatDialog,
 ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.listarEstados();
    this.listarIdRespuestaEvaluacion();
  }

  private crearFormulario() {
    this.formRespuesta = this.fb.group({
      id: 0,
      descripcion: [null,Validators.required],
      correcta: [null,Validators.required],
      estado: [null,Validators.required],
    });
  }

  public listarEstados() {
    this.servicioConsultasGenerales.listarEstadosIdModulo(11).subscribe(resEstados=>{
      this.listaEstados = resEstados;
    })
  }

  public listarIdRespuestaEvaluacion() {
    this.listaRespuestaEvaluacion = this.preguntaEvaluacion;
    this.formRespuesta.controls['id'].setValue(this.listaRespuestaEvaluacion[0].id);
    if(this.listaRespuestaEvaluacion[0].correcta == 0){
      this.formRespuesta.controls['correcta'].setValue('incorrecta');
    }else if(this.listaRespuestaEvaluacion[0].correcta == 1){
      this.formRespuesta.controls['correcta'].setValue('correcta');
    }
    this.formRespuesta.controls['descripcion'].setValue(this.listaRespuestaEvaluacion[0].descripcion);
    this.formRespuesta.controls['estado'].setValue(this.listaRespuestaEvaluacion[0].idEstado.id);
  }

  public guardar() {
    if(this.formRespuesta.valid){
      document.getElementById('snipper')?.setAttribute('style', 'display: block;')
      var valorCorrecta = 0
      var existeRespuestaCorrecta = []
      if(this.formRespuesta.value.correcta == 'correcta'){
        valorCorrecta = 1
        existeRespuestaCorrecta = this.listaRespuestaEvaluacion[1].filter((respuesta:any)=> respuesta.id != this.listaRespuestaEvaluacion[0].id && respuesta.idPreguntaEvaluacion == this.listaRespuestaEvaluacion[0].idPreguntaEvaluacion.id && respuesta.correcta == true && respuesta.idEstado == 19)
      }else if(this.formRespuesta.value.correcta == 'incorrecta'){
        valorCorrecta = 0
      }
      var existeRespuestaEvaluacion = this.listaRespuestaEvaluacion[1].filter((respuesta:any)=> respuesta.id != this.listaRespuestaEvaluacion[0].id && respuesta.descripcion.toUpperCase() == this.formRespuesta.value.descripcion.toUpperCase() && respuesta.idPreguntaEvaluacion == this.listaRespuestaEvaluacion[0].idPreguntaEvaluacion.id)
      var igualRespuestaEvaluacion = this.listaRespuestaEvaluacion[1].filter((respuesta:any)=> respuesta.id == this.listaRespuestaEvaluacion[0].id && respuesta.descripcion.toUpperCase() == this.formRespuesta.value.descripcion.toUpperCase() && respuesta.idPreguntaEvaluacion == this.listaRespuestaEvaluacion[0].idPreguntaEvaluacion.id && respuesta.correcta == valorCorrecta && respuesta.idEstado == this.formRespuesta.value.estado)
      if(igualRespuestaEvaluacion.length > 0){
        document.getElementById('snipper')?.setAttribute('style', 'display: none;')
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'No hubieron cambios!',
          showConfirmButton: false,
          timer: 1500
        })
        this.dialogRef.close()
      }else if(existeRespuestaEvaluacion.length > 0){
        if(existeRespuestaEvaluacion[0].idEstado.id == 19){
          document.getElementById('snipper')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ese respuesta ya existe!',
            showConfirmButton: false,
            timer: 1500
          })
        }else{
          document.getElementById('snipper')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Esa respuesta ya existe, solo que esta inactiva!',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }else if(existeRespuestaCorrecta.length > 0){
        document.getElementById('snipper')?.setAttribute('style', 'display: none;')
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Ya existe una respuesta correcta!',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        let modificarRespuesta : RespuestaEvaluacionModificar = new RespuestaEvaluacionModificar();
        modificarRespuesta.id = this.listaRespuestaEvaluacion[0].id
        if(this.formRespuesta.value.correcta == 'correcta'){
          modificarRespuesta.correcta = true
        }else if(this.formRespuesta.value.correcta == 'incorrecta'){
          modificarRespuesta.correcta = false
        }
        modificarRespuesta.descripcion = this.formRespuesta.value.descripcion.toUpperCase()
        modificarRespuesta.idPreguntaEvaluacion = this.listaRespuestaEvaluacion[0].idPreguntaEvaluacion.id
        modificarRespuesta.idEstado = this.formRespuesta.value.estado
        this.actualizarRespuestaEvaluacion(modificarRespuesta)
      }
    }else{
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Los campos estan vacios!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  private actualizarRespuestaEvaluacion(modificarRespuesta :RespuestaEvaluacionModificar){
    this.servicioModificar.actualizarRespuestaEvaluacion(modificarRespuesta).subscribe(res => {
      document.getElementById('snipper')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Respuesta modificada!',
        showConfirmButton: false,
        timer: 1500
      })
      this.dialogRef.close();
      location.reload();
    }, error => {
      document.getElementById('snipper')?.setAttribute('style', 'display: none;')
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
