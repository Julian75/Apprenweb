import { Component, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CursoEstudiante } from 'src/app/models/cursoEstudiante';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { CursoService } from 'src/app/services/curso.service';
import { CursoEstudianteService } from 'src/app/services/cursoEstudiante.service';
import { EstadoService } from 'src/app/services/estado.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { DOCUMENT } from '@angular/common';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-visualizar-cursos',
  templateUrl: './visualizar-cursos.component.html',
  styleUrls: ['./visualizar-cursos.component.css']
})
export class VisualizarCursosComponent {

  public listaCursos: any = [];
  public listaCursos2: any = [];

  constructor(
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioCursoEstudiante: CursoEstudianteService,
    private servicioUsuario: UsuarioService,
    private servicioEstado: EstadoService,
    private servicioCurso: CursoService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) document: any,
    public servicioShared: SharedService
  ) { }

  ngOnInit(): void {
    this.listarCursos();
  }

  listaArchivos: any = []
  document: any = ""
  public listarCursos(){
    this.document = document.location.href
    if(document.location.href == this.servicioShared.direccionUrl+"vista/misCursosEstudianteV"){
      this.servicioConsultasGenerales.listarContenidoCursoIdCategoria(0, 2, Number(sessionStorage.getItem('id'))).subscribe(resCursosInscritos=>{
        if(resCursosInscritos.length > 0){
          resCursosInscritos.filter((element: any)=>{
            this.listaArchivos = []
            var archivosSeparados = (element.descripcionArchivo.split(',')).filter((archivosSep: any)=> this.listaArchivos.push(archivosSep))
            var obj = {
              datos: element,
              archivoPrincipal: this.listaArchivos[0],
              archivos: []
            }
            if(this.listaArchivos.length > 1){
              obj.archivos = this.listaArchivos.filter((archivo:any, index:any)=> index != 0)
            }
            this.listaCursos2.push(obj)
          })
        }
      })
    }else{
      this.route.paramMap.subscribe((params: ParamMap) => {
        var idCategoria = params.get('id')
        this.servicioConsultasGenerales.listarContenidoCursoIdCategoria(Number(idCategoria), 1, 0).subscribe(res=>{
          this.servicioConsultasGenerales.listarCursoEstudianteExistente(Number(sessionStorage.getItem('id')), Number(idCategoria)).subscribe(resCursos=>{
            if(resCursos.length > 0){
              this.listaCursos = res.filter(cursos => resCursos.some(curEstudiante => curEstudiante.idCurso != cursos.idCurso))
            }else{
              this.listaCursos = res
            }
            if(this.listaCursos.length > 0){
              this.listaCursos.forEach((element: any) => {
                this.listaArchivos = []
                var archivosSeparados = element.descripcionArchivo.split(',')
                archivosSeparados.forEach((element: any) => {
                  this.listaArchivos.push(element)
                });
                var obj = {
                  datos: element,
                  archivoPrincipal: this.listaArchivos[0],
                  archivos: this.listaArchivos.filter((archivo:any, index:any)=> index != 0)
                }
                this.listaCursos2.push(obj)
              });
            }
          })
        })
      })
    }
  }

  public registrarCurso(contenido:any){
    document.getElementById('snipper')?.setAttribute('style', 'display: block;')
    this.servicioCurso.listarPorId(contenido.idCurso).subscribe(resCurso=>{
      this.servicioEstado.listarPorId(14).subscribe(resEstado=>{
        this.servicioUsuario.listarPorId(Number(sessionStorage.getItem('id'))).subscribe(resUsuario=>{
          let cursoEstudiante: CursoEstudiante = new CursoEstudiante;
          cursoEstudiante.fecha = moment().format('YYYY-MM-DD HH:mm:ss A')
          cursoEstudiante.idCurso = resCurso
          cursoEstudiante.idEstado = resEstado
          cursoEstudiante.idUsuario = resUsuario
          this.servicioCursoEstudiante.registrar(cursoEstudiante).subscribe(res=>{
            document.getElementById('snipper')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Registro al curso exitoso!',
              showConfirmButton: false,
              timer: 1500
            })
            location.reload();
          }, error => {
            document.getElementById('snipper')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Hubo un error al registrarse en el curso!',
              showConfirmButton: false,
              timer: 1500
            })
          });
        })
      })
    })
  }

}
