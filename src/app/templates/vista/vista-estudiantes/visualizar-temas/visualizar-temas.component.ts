import { Component, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { CursoService } from 'src/app/services/curso.service';
import { SeccionCursoService } from 'src/app/services/seccionCurso.service';
import { DomSanitizer} from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { TemaCursoService } from 'src/app/services/temaCurso.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-visualizar-temas',
  templateUrl: './visualizar-temas.component.html',
  styleUrls: ['./visualizar-temas.component.css']
})
export class VisualizarTemasComponent {

  public listaVideos: any = []
  public listaArchivos: any = []
  public listaContenido: any = []
  public listaTemas: any = []
  public listaImagenes: any = []
  public listaDocumentos: any = []

  //Imagen de archivos
  fullscreen: boolean = false;
  imageIndex1: number = 0;
  listaFotosCurso: any = [];

  constructor(
    private route: ActivatedRoute,
    private servicioTemaCurso: TemaCursoService,
    private servicioCurso: CursoService,
    private servicioSeccion: SeccionCursoService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private sanitized: DomSanitizer,
    private router: Router,
    @Inject(DOCUMENT) document: any,

  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  idCurso: any = 0;
  indiceTemaActual: any;
  temaAnterior: any;
  listaSoloEvaluaciones: any = [];
  private listarTodos(){
    this.route.paramMap.subscribe((params: ParamMap) => {
      var idCapturadoUrl = params.get('id')
      this.servicioSeccion.listarPorId(Number(idCapturadoUrl)).subscribe(resSeccion=>{
        this.idCurso = resSeccion.idCurso.id
        this.servicioConsultasGenerales.listarTemasCursoActivas(resSeccion.id).subscribe(resTemas=>{
          var obj = {
            tema: resTemas[0],
            evaluacionResuelta: true
          }
          this.listaTemas.push(obj)
          resTemas.forEach((element, index) => {
            if(index != 0){
              if(element.evaluacion == "SI"){
                this.listaSoloEvaluaciones = resTemas.filter(temaLista => temaLista.evaluacion == "SI")
                this.indiceTemaActual = this.listaSoloEvaluaciones.map((temasLista: any) => temasLista.id).indexOf(element.id)
                this.temaAnterior = this.listaSoloEvaluaciones[this.indiceTemaActual-1]
                // for (let i = 0; i < resTemas.length; i++) {
                //   this.temaAnterior = this.listaSoloEvaluaciones[this.indiceTemaActual-1]
                //   if(this.temaAnterior.evaluacion == "NO"){
                //     this.indiceTemaActual = this.indiceTemaActual-1
                //     this.temaAnterior = this.listaSoloEvaluaciones[this.indiceTemaActual-1]
                //   }else{
                //     break
                //   }
                // }
                this.servicioConsultasGenerales.listarPreguntasidTemaCurso(this.temaAnterior.id).subscribe(resPreguntasTema => {
                  this.listaPreguntasTema = resPreguntasTema.filter(preguntas => preguntas.idEstado != 18)
                  this.servicioConsultasGenerales.listarEvaluacionesResueltasUsuTema(Number(sessionStorage.getItem('id')), this.temaAnterior.id).subscribe(resRespuestas =>{
                    var objValidacion = {
                      tema: element,
                      evaluacionResuelta: false
                    }
                    if(this.listaPreguntasTema.length == resRespuestas.length){
                      objValidacion.evaluacionResuelta = true
                    }
                    this.listaTemas.push(objValidacion)
                  })
                })
              }else{
                // if(index == 1){
                //   this.servicioConsultasGenerales.listarPreguntasidTemaCurso().subscribe(resPreguntasTema => {
                //     this.listaPreguntasTema = resPreguntasTema.filter(preguntas => preguntas.idEstado != 18)
                //     this.servicioConsultasGenerales.listarEvaluacionesResueltasUsuTema(Number(sessionStorage.getItem('id')), this.temaAnterior.id).subscribe(resRespuestas =>{
                //       console.log(resRespuestas, this.temaAnterior)
                //       var objValidacion = {
                //         tema: element,
                //         evaluacionResuelta: false
                //       }
                //       if(this.listaPreguntasTema.length == resRespuestas.length){
                //         objValidacion.evaluacionResuelta = true
                //       }
                //       this.listaTemas.push(objValidacion)
                //     })
                //   })
                // }else{
                  var objValidacion = {
                    tema: element,
                    evaluacionResuelta: true
                  }
                  this.listaTemas.push(objValidacion)
                // }
              }
            }
          });
        })
      })
    })
  }

  cardAnterior: any;
  video: any;
  posicionVideo: any;
  archivo: any;
  posicionArchivo: any;
  temaActual: any = []
  listaPreguntasTema: any = [];
  public seleccionarTema(tema: any){
    this.temaActual = tema
    this.listaVideos = []
    this.listaArchivos = []
    this.listaFotosCurso = []
    this.listaPreguntasTema = []
    this.listaSoloEvaluaciones = []
    this.listaContenido = []
    if(tema.id == this.listaTemas[0].tema.id || tema.evaluacion == 'NO'){
      this.servicioConsultasGenerales.listarContenidoCursoidTema(tema.id).subscribe(resContenidoCurso=>{
        if(resContenidoCurso.length > 0){
          this.listaContenido = resContenidoCurso
          if(this.cardAnterior != null && this.cardAnterior != undefined){
            document.getElementById('card'+this.cardAnterior)?.setAttribute("style", "background: #969090;")
          }
          document.getElementById('card'+tema.id)?.setAttribute("style", "background-image: linear-gradient(180deg, #213360, #425892);")
          this.cardAnterior = tema.id
          //Videos
          this.listaVideos = this.listaContenido.filter((contenido: any) => contenido.descripcionArchivo.match(/mp4.*/) && contenido.idTemaCurso == tema.id)
          if(this.listaVideos.length > 0){
            this.video = this.sanitized.bypassSecurityTrustResourceUrl("assets/contenido-curso/"+this.listaVideos[0].descripcionArchivo)
            this.posicionVideo = 0
          }
          //Todos los archivos del tema
          this.listaArchivos = this.listaContenido.filter((contenido: any) => (contenido.descripcionArchivo.match(/pdf.*/) || contenido.descripcionArchivo.match(/csv.*/) || contenido.descripcionArchivo.match(/docx.*/) || contenido.descripcionArchivo.match(/pptx.*/) || contenido.descripcionArchivo.match(/xlsx.*/) || contenido.descripcionArchivo.match(/jpg.*/) || contenido.descripcionArchivo.match(/png.*/) || contenido.descripcionArchivo.match(/jfif.*/) || contenido.descripcionArchivo.match(/jpeg.*/)) && contenido.idTemaCurso == tema.id)
          if(this.listaArchivos.length > 0){
            this.archivo = this.sanitized.bypassSecurityTrustResourceUrl("assets/contenido-curso/"+this.listaArchivos[0].descripcionArchivo)
            this.posicionArchivo = 0
          }
        }else{
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Este tema aun no tiene ningun contenido!',
            showConfirmButton: false,
            timer: 2000
          })
        }
      })
    }else{
      this.listaSoloEvaluaciones = this.listaTemas.filter((temaLista: any) => temaLista.tema.evaluacion == "SI")
      var indiceTemaActual = this.listaSoloEvaluaciones.filter((temasLista: any) => temasLista.tema.evaluacion != 'NO')
      indiceTemaActual = indiceTemaActual.map((temasLista: any) => temasLista.tema.id).indexOf(tema.id)
      var temaAnterior = this.listaSoloEvaluaciones[indiceTemaActual-1]
      this.servicioConsultasGenerales.listarPreguntasidTemaCurso(temaAnterior.tema.id).subscribe(resPreguntasTema => {
        this.listaPreguntasTema = resPreguntasTema.filter(preguntas => preguntas.idEstado != 18)
        this.servicioConsultasGenerales.listarEvaluacionesResueltasUsuTema(Number(sessionStorage.getItem('id')), temaAnterior.tema.id).subscribe(resRespuestas =>{
          if(resRespuestas.length > 0){
            if(this.listaPreguntasTema.length == resRespuestas.length){
              this.servicioConsultasGenerales.listarContenidoCursoidTema(tema.id).subscribe(resContenidoCurso=>{
                if(resContenidoCurso.length > 0){
                  this.listaContenido = resContenidoCurso
                  if(this.cardAnterior != null && this.cardAnterior != undefined){
                    document.getElementById('card'+this.cardAnterior)?.setAttribute("style", "background: #969090;")
                  }
                  document.getElementById('card'+tema.id)?.setAttribute("style", "background-image: linear-gradient(180deg, #213360, #425892);")
                  this.cardAnterior = tema.id
                  //Videos
                  this.listaVideos = this.listaContenido.filter((contenido: any) => contenido.descripcionArchivo.match(/mp4.*/) && contenido.idTemaCurso == tema.id)
                  if(this.listaVideos.length > 0){
                    this.video = this.sanitized.bypassSecurityTrustResourceUrl("assets/contenido-curso/"+this.listaVideos[0].descripcionArchivo)
                    this.posicionVideo = 0
                  }
                  //Todos los archivos del tema
                  this.listaArchivos = this.listaContenido.filter((contenido: any) => (contenido.descripcionArchivo.match(/pdf.*/) || contenido.descripcionArchivo.match(/csv.*/) || contenido.descripcionArchivo.match(/docx.*/) || contenido.descripcionArchivo.match(/pptx.*/) || contenido.descripcionArchivo.match(/xlsx.*/) || contenido.descripcionArchivo.match(/jpg.*/) || contenido.descripcionArchivo.match(/png.*/) || contenido.descripcionArchivo.match(/jfif.*/)) && contenido.idTemaCurso == tema.id)
                  if(this.listaArchivos.length > 0){
                    this.archivo = this.sanitized.bypassSecurityTrustResourceUrl("assets/contenido-curso/"+this.listaArchivos[0].descripcionArchivo)
                    this.posicionArchivo = 0
                  }
                  //Archivos que sean imagenes
                  // this.listaImagenes = this.listaArchivos.filter((contenido: any) => (contenido.descripcionArchivo.match(/jpg.*/) || contenido.descripcionArchivo.match(/png.*/) || contenido.descripcionArchivo.match(/jfif.*/)))
                  // this.listaImagenes.filter((imagenes: any)=> this.listaFotosCurso.push('assets/contenido-curso/'+imagenes.descripcionArchivo))
                  //Archivos que sean documentos
                  // this.listaDocumentos = this.listaArchivos.filter((contenido: any) => contenido.descripcionArchivo.match(/pdf.*/) || contenido.descripcionArchivo.match(/csv.*/) || contenido.descripcionArchivo.match(/docx.*/) || contenido.descripcionArchivo.match(/pptx.*/) || contenido.descripcionArchivo.match(/xlsx.*/))
                }else{
                  Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Este tema aun no tiene ningun contenido!',
                    showConfirmButton: false,
                    timer: 2000
                  })
                }
              })
            }else{
              Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Faltan por contestar preguntas en la evaluacion del tema anterior!',
                showConfirmButton: false,
                timer: 2000
              })
            }
          }else{
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Aun no ha resuelto la evaluacion del tema anterior!',
              showConfirmButton: false,
              timer: 2000
            })
          }
        })
      })
    }
    this.habilitarEvaluacion(tema)
  }

  habilitarEvaluacion(temaActual: any){
    this.servicioTemaCurso.listarPorId(temaActual.id).subscribe(resTemaIde=>{
      this.servicioConsultasGenerales.listarTemasEvaluacionCurso(Number(resTemaIde.idSeccionCurso.idCurso.id), Number(sessionStorage.getItem('id'))).subscribe(resTemasEvaluacionCurso=>{
        var existeEvaluacionCorrecta: any = []
        if(resTemasEvaluacionCurso.length > 0){
          resTemasEvaluacionCurso.filter(temaEvaluacion=>{
            if(temaEvaluacion.evaluacionEstudiante != ""){
              if((temaEvaluacion.evaluacionEstudiante.split(',')).filter(idTemaCurso=> Number(idTemaCurso) == Number(resTemaIde.id)).length > 0){
                existeEvaluacionCorrecta.push(temaEvaluacion)
              }
            }
          })
        }
        this.servicioConsultasGenerales.listarPreguntasidTemaCurso(temaActual.id).subscribe(resPreguntasTema=>{
          var preguntasTemaActivas = resPreguntasTema.filter(pregunt=> pregunt.idEstado == 17)
          if(preguntasTemaActivas.length > 0 && existeEvaluacionCorrecta.length == 0){
            document.getElementById('bottonEvaluacion')?.setAttribute("style", "display: block;")
          }
        })
      })
    })
  }

  formularioEvaluacion(){
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.router.navigate(['/vista/formularioSeccionEvaluacion/'+this.temaActual.id], { queryParams: { idSeccion: String(params.get('id')) }, skipLocationChange: true });
    })
  }

  public previo(){
    if(this.posicionVideo != 0){
      this.posicionVideo = this.posicionVideo-1
      this.video = this.sanitized.bypassSecurityTrustResourceUrl("assets/contenido-curso/"+this.listaVideos[this.posicionVideo].descripcionArchivo)
    }else{
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'No se puede retroceder mas',
        showConfirmButton: false,
        timer: 2500
      })
    }
  }

  public siguiente(){
    if(this.posicionVideo < this.listaVideos.length){
      this.posicionVideo = this.posicionVideo+1
      this.video = this.sanitized.bypassSecurityTrustResourceUrl("assets/contenido-curso/"+this.listaVideos[this.posicionVideo].descripcionArchivo)
    }else{
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'No se puede avanzar mas',
        showConfirmButton: false,
        timer: 2500
      })
    }
  }

  public descargarArchivo(documento: any){
    console.log(documento)
    window.location.href = "assets/contenido-curso/"+documento.descripcionArchivo
  }
}
