import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { CursoService } from 'src/app/services/curso.service';
import { TemaCursoService } from 'src/app/services/temaCurso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-visualizar-secciones-curso',
  templateUrl: './visualizar-secciones-curso.component.html',
  styleUrls: ['./visualizar-secciones-curso.component.css']
})
export class VisualizarSeccionesCursoComponent {

  public listaCursoIde: any = []

  constructor(
    private route: ActivatedRoute,
    private servicioCurso: CursoService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioTemasCurso: TemaCursoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  listaContenidoCurso: any = []
  listaContenidoDosCurso: any = []
  listaSeccionesCurso: any = []
  faseSeccion: number = 0;
  private listarTodos(){
    this.route.paramMap.subscribe((params: ParamMap) => {
      var idCapturadoUrl = params.get('id')
      this.servicioTemasCurso.listarTodos().subscribe(resTemasCursosTodos=>{
        this.servicioConsultasGenerales.listarTemasEvaluacionCurso(Number(idCapturadoUrl), Number(sessionStorage.getItem('id'))).subscribe(resTemasEvaluacionCurso=>{
          this.servicioConsultasGenerales.listarContenidoCursoIdCurso(Number(idCapturadoUrl)).subscribe(resContenidoCurso=>{
            this.servicioConsultasGenerales.listarSeccionesCurso(Number(idCapturadoUrl)).subscribe(resSeccionesCurso=>{
              this.servicioCurso.listarPorId(Number(idCapturadoUrl)).subscribe(resCursoIde=>{
                if(resSeccionesCurso.length > 0){
                  this.faseSeccion = 1
                  if(resTemasEvaluacionCurso.length > 0){
                    resSeccionesCurso.filter(seccion=>{
                      var temasSeccion = resTemasCursosTodos.filter(tema=> tema.idSeccionCurso.id == seccion.idSeccionCurso)
                      if(temasSeccion.length > 0){
                        resTemasEvaluacionCurso.filter(temaEvaluacion=> {
                          if(temaEvaluacion.evaluacionEstudiante != ""){
                            var temaValidadoSeccion = temasSeccion.filter(temaSec=> (temaEvaluacion.evaluacionEstudiante.split(',').includes(String(temaSec.id))) == true)
                            if(temaValidadoSeccion.length == temasSeccion.length){
                              this.faseSeccion = seccion.fase
                            }
                          }
                        })
                      }
                    })
                  }
                  this.listaSeccionesCurso = resSeccionesCurso
                  this.listaSeccionesCurso.sort((a: any, b: any) => {
                    return a.fase - b.fase;
                  });
                }
                this.listaCursoIde = resCursoIde
                this.listaContenidoCurso = resContenidoCurso
                if(resContenidoCurso.length > 1){
                  this.listaContenidoDosCurso = resContenidoCurso.filter((archivo:any, index:any)=> index != 0)
                }
              })
            })
          })
        })
      })
    })
  }

  direccionarTema(seccion: any){
    if(seccion.idSeccionCurso <= this.faseSeccion){
      this.router.navigate(['/vista/temasCursoEstudiante/'+seccion.idSeccionCurso]);
    }else{
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'No ha llegado hasta ese avance!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }
}
