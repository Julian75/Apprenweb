import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EstadoService } from 'src/app/services/estado.service';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { RespuestaEvaluacionService } from 'src/app/services/respuestaEvaluacion.service';
import { RespuestaEvaluacion } from 'src/app/models/respuestaEvalucion';
import { PreguntaEvaluacionService } from 'src/app/services/preguntaEvaluacion.service';

@Component({
  selector: 'app-agregar-respuesta-evaluacion',
  templateUrl: './agregar-respuesta-evaluacion.component.html',
  styleUrls: ['./agregar-respuesta-evaluacion.component.css']
})
export class AgregarRespuestaEvaluacionComponent {

  public formRespuestas!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AgregarRespuestaEvaluacionComponent>,
    private servicioPreguntas: PreguntaEvaluacionService,
    private servicioRespuestas: RespuestaEvaluacionService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioEstado: EstadoService,
    @Inject(MAT_DIALOG_DATA) public pregunta: MatDialog,
  ) { }


  ngOnInit(): void {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.formRespuestas = this.fb.group({
      id: 0,
      descripcion: [null,Validators.required],
      correcta: [null,Validators.required],
    });
  }

  public guardar() {
    if(this.formRespuestas.valid){
      document.getElementById('snipper')?.setAttribute('style', 'display: block;')
      this.servicioRespuestas.listarTodos().subscribe(resRespuesta=>{
        var existeRespuesta = resRespuesta.filter(respuestaEvaluacion => respuestaEvaluacion.descripcion.toUpperCase() == this.formRespuestas.value.descripcion.toUpperCase() && respuestaEvaluacion.idPreguntaEvaluacion.id == Number(this.pregunta))
        var existeRespuestaCorrecta = []
        if(this.formRespuestas.value.correcta == "correcta"){
          existeRespuestaCorrecta = resRespuesta.filter(respuestaEvaluacion => respuestaEvaluacion.idPreguntaEvaluacion.id == Number(this.pregunta) && respuestaEvaluacion.correcta == true && respuestaEvaluacion.idEstado.id == 19)
        }
        if(existeRespuesta.length > 0){
          if(existeRespuesta[0].idEstado.id == 19){
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
            title: 'Ya existe una respuesta correcta en esta pregunta!',
            showConfirmButton: false,
            timer: 1500
          })
        }else{
          this.servicioEstado.listarPorId(19).subscribe(resEstado=>{
            this.servicioPreguntas.listarPorId(Number(this.pregunta)).subscribe(resPregunta=>{
              let respuestaEvaluacion : RespuestaEvaluacion = new RespuestaEvaluacion();
              respuestaEvaluacion.descripcion = this.formRespuestas.value.descripcion.toUpperCase()
              if(this.formRespuestas.value.correcta == "correcta"){
                respuestaEvaluacion.correcta = true
              }else if(this.formRespuestas.value.correcta == "incorrecta"){
                respuestaEvaluacion.correcta = false
              }
              respuestaEvaluacion.idEstado = resEstado;
              respuestaEvaluacion.idPreguntaEvaluacion = resPregunta
              this.registrarRespuesta(respuestaEvaluacion);
            })
          })
        }
      })
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

  public registrarRespuesta(respuestaEvaluacion: RespuestaEvaluacion) {
    this.servicioRespuestas.registrar(respuestaEvaluacion).subscribe(res=>{
      document.getElementById('snipper')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Respuesta Registrada!',
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
        title: 'Hubo un error al agregar!',
        showConfirmButton: false,
        timer: 1500
      })
    });
  }
}
