import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EvaluacionSeccionEstudiante } from 'src/app/models/evaluacionSeccionEstudiante';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { EstadoService } from 'src/app/services/estado.service';
import { EvaluacionSeccionEstudianteService } from 'src/app/services/evaluacionSeccionEstudiante.service';
import { PreguntaEvaluacionService } from 'src/app/services/preguntaEvaluacion.service';
import { RespuestaEvaluacionService } from 'src/app/services/respuestaEvaluacion.service';
import { TemaCursoService } from 'src/app/services/temaCurso.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-seccion-evaluacion',
  templateUrl: './formulario-seccion-evaluacion.component.html',
  styleUrls: ['./formulario-seccion-evaluacion.component.css']
})
export class FormularioSeccionEvaluacionComponent {

  public temaIde: any = []
  public formTemaCursoEvaluacion!: FormGroup;
  public listaPreguntasSecciones: any = []
  public listaPreguntaRespuesta: any = []
  public listaEvaluacionSeleccion: any = []

  constructor(
    private route: ActivatedRoute,
    private servicioTemaCurso: TemaCursoService,
    private servicioUsuario: UsuarioService,
    private servicioEstado: EstadoService,
    private router: Router,
    private servicioPregunta: PreguntaEvaluacionService,
    private servicioRespuestas: RespuestaEvaluacionService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioFormularioSeccionEvaluacion: EvaluacionSeccionEstudianteService
  ) { }


  ngOnInit(): void {
    this.listarTodos();
  }

  public listarTodos(){
    this.route.paramMap.subscribe((params: ParamMap) => {
      var idCapturadoUrl = params.get('id')
      this.servicioConsultasGenerales.listarPreguntasidTemaCurso(Number(idCapturadoUrl)).subscribe(resPreguntasTemaCurso=>{
        this.servicioConsultasGenerales.listarRespuestasidTemaCurso(Number(idCapturadoUrl)).subscribe(resRespuestasTemaCurso=>{
          this.servicioTemaCurso.listarPorId(Number(idCapturadoUrl)).subscribe(resTemaCurso=>{
            this.temaIde = resTemaCurso
            this.listaPreguntasSecciones = resPreguntasTemaCurso
            resPreguntasTemaCurso.filter(pregunta=>{
              var listasRespuestasPregunta = resRespuestasTemaCurso.filter(respuesta=> respuesta.idPreguntaEvaluacion == pregunta.id)
              var respuestaCorrecta = resRespuestasTemaCurso.filter(respuesta=> respuesta.idPreguntaEvaluacion == pregunta.id && respuesta.correcta == true)
              var obj = {
                pregunta: pregunta,
                respuestas: listasRespuestasPregunta,
                respuestaCorrecta: respuestaCorrecta
              }
              this.listaPreguntaRespuesta.push(obj)
            })
          })
        })
      })
    })

  }

  almacenarEvaluacion(respuestaS: any, preguntaS: any){
    var obj = {
      pregunta: preguntaS,
      respuesta: respuestaS
    }
    if(this.listaEvaluacionSeleccion.length > 0){
      var existePregunta = this.listaEvaluacionSeleccion.filter((evaluacion: any)=> evaluacion.pregunta.pregunta.id == preguntaS.pregunta.id)
      if(existePregunta.length > 0){
        var existeDiferente = this.listaEvaluacionSeleccion.filter((evaluacion: any)=> evaluacion.respuesta.id != respuestaS.id)
        if(existeDiferente.length > 0){
          var indexLista = this.listaEvaluacionSeleccion.map((evaluacion: any) => evaluacion.pregunta.pregunta.id).indexOf(existePregunta[0].pregunta.pregunta.id)
          this.listaEvaluacionSeleccion[indexLista].respuesta = respuestaS
        }
      }else{
        this.listaEvaluacionSeleccion.push(obj)
      }
    }else{
      this.listaEvaluacionSeleccion.push(obj)
    }
  }

  preguntaIdeSE: any = {}
  respuestaIdeSE: any = {}
  public guardar(){
    if(this.listaPreguntasSecciones.length == this.listaEvaluacionSeleccion.length){
      document.getElementById('snipperAgregarTemaCursoEvaluacion')?.setAttribute('style', 'display: block;')
      this.servicioPregunta.listarTodos().subscribe(resPreguntasTodos=>{
        this.servicioRespuestas.listarTodos().subscribe(resRespuestasTodos=>{
          this.servicioEstado.listarPorId(26).subscribe(resPerdioEvaluacion=>{
            this.servicioEstado.listarPorId(27).subscribe(resPasoEvaluacion=>{
              this.servicioUsuario.listarPorId(Number(sessionStorage.getItem('id'))).subscribe(resUsuarioIde=>{
                for (let iEvaluacionS = 0; iEvaluacionS < this.listaEvaluacionSeleccion.length; iEvaluacionS++) {
                  const elementEvaluacionS = this.listaEvaluacionSeleccion[iEvaluacionS];
                  let formularioSeccionEvaluacion : EvaluacionSeccionEstudiante = new EvaluacionSeccionEstudiante();
                  this.preguntaIdeSE = resPreguntasTodos.filter(preguntaIde=> preguntaIde.id == elementEvaluacionS.pregunta.pregunta.id)
                  this.respuestaIdeSE = resRespuestasTodos.filter(respuestaIde=> respuestaIde.id == elementEvaluacionS.respuesta.id)
                  formularioSeccionEvaluacion.idEstado = resPerdioEvaluacion
                  if(elementEvaluacionS.respuesta.id == elementEvaluacionS.pregunta.respuestaCorrecta[0].id){
                    formularioSeccionEvaluacion.idEstado = resPasoEvaluacion
                  }
                  formularioSeccionEvaluacion.idPreguntaEvaluacion = this.preguntaIdeSE[0]
                  formularioSeccionEvaluacion.idRespuestaEvaluacion = this.respuestaIdeSE[0]
                  formularioSeccionEvaluacion.idUsuario = resUsuarioIde
                  this.servicioFormularioSeccionEvaluacion.registrar(formularioSeccionEvaluacion).subscribe(resEvaluacionRegistrada=>{
                    document.getElementById('snipperAgregarTemaCursoEvaluacion')?.setAttribute('style', 'display: none;')
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: 'Se registro la evaluacion!',
                      showConfirmButton: false,
                      timer: 1500
                    })
                    location.reload()
                  }, error => {
                    document.getElementById('snipperAgregarTemaCursoEvaluacion')?.setAttribute('style', 'display: none;')
                    Swal.fire({
                      position: 'center',
                      icon: 'error',
                      title: 'Hubo un error al registrar la evaluacion!',
                      showConfirmButton: false,
                      timer: 1500
                    })
                  });
                }
              })
            })
          })
        })
      })
    }else{
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Falta completar la evaluación!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  devolver(){
    this.route.queryParams.subscribe(params => {
      this.router.navigate(['/vista/temasCursoEstudiante/'+params['idSeccion']]);
    });
  }

}
