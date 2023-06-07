import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EstadoService } from 'src/app/services/estado.service';
import { CursoService } from 'src/app/services/curso.service';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { SharedService } from 'src/app/shared.service';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { TemaCurso } from 'src/app/models/temaCurso';
import { TemaCursoService } from 'src/app/services/temaCurso.service';
import { SeccionCursoService } from 'src/app/services/seccionCurso.service';
import { ContenidoCursoService } from 'src/app/services/contenidoCurso.service';
import { ContenidoCurso } from 'src/app/models/contenidoCurso';

@Component({
  selector: 'app-agregar-contenido-curso',
  templateUrl: './agregar-contenido-curso.component.html',
  styleUrls: ['./agregar-contenido-curso.component.css']
})
export class AgregarContenidoCursoComponent {
  public formContenidoCurso!: FormGroup;
  public listaTemaCursosTodos: any = []
  public listaCategorias: any = []
  public listaCursos: any = []
  public listaSeccionCursos: any = []
  public listaTemasCurso: any = []

  //SELECT FILES
  public listaContenidoCurso: any = []
  public cantidadArchivos: Number = 0
  public percentDone: number = 0;
  public uploadSuccess: boolean = false;

// Consultas
  public listaCursosConsulta: any = []
  public listaSeccionCursosConsulta: any = []
  public listaTemasCursosConsulta: any = []
  public listaContenidosCursosConsulta: any = []

  public listaSelecciones: any = []

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AgregarContenidoCursoComponent>,
    private servicioCurso: CursoService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioEstado: EstadoService,
    private servicioUsuario: UsuarioService,
    private servicioCategoria: CategoriaService,
    private servicioSeccionCurso: SeccionCursoService,
    private servicioContenidoCurso: ContenidoCursoService,
    private servicioShared: SharedService,
    private servicioTemasCurso: TemaCursoService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public temasCursos: MatDialog,
  ) { }


  ngOnInit(): void {
    this.listaSelecciones = []
    this.crearFormulario();
    this.listarCurso()
    this.listarCategorias();
  }

  private crearFormulario() {
    this.formContenidoCurso = this.fb.group({
      id: 0,
      categoria: [null,Validators.required],
      curso: [null,Validators.required],
      seccionCurso: [null,Validators.required],
      temaCurso: [null,Validators.required],
    });
    this.listaTemaCursosTodos = this.temasCursos
  }

  public listarCategorias(){
    this.servicioConsultasGenerales.listarCategoriasActivas().subscribe(res=>{
      this.listaCategorias = res
    })
  }

  public listarCurso(){
    this.servicioContenidoCurso.listarTodos().subscribe(resContenidosCurso=>{
      this.servicioCurso.listarTodos().subscribe(resCursosTodos=> {
        this.servicioSeccionCurso.listarTodos().subscribe(resSeccionesCurso=> {
          this.servicioTemasCurso.listarTodos().subscribe(resTemasCursos=> {
            this.servicioUsuario.listarPorId(Number(sessionStorage.getItem('id'))).subscribe(resUsuarioIde=> {
              this.listaCursosConsulta = resCursosTodos;
              this.listaSeccionCursosConsulta = resSeccionesCurso
              this.listaTemasCursosConsulta = resTemasCursos
              this.listaContenidosCursosConsulta = resContenidosCurso
              if(resUsuarioIde.idRol.id != 1){
                if(resCursosTodos.length > 0){
                  this.listaCursosConsulta = resCursosTodos.filter(curs=> curs.idUsuario.id == Number(sessionStorage.getItem('id')) && curs.idEstado.id == 10);
                  if(resSeccionesCurso.length > 0){
                    this.listaSeccionCursosConsulta = resSeccionesCurso.filter(seccionC=> seccionC.idCurso.idUsuario.id == Number(sessionStorage.getItem('id')) && seccionC.idEstado.id == 12)
                    if(resTemasCursos.length > 0){
                      this.listaTemasCursosConsulta = resTemasCursos.filter(temasC=> temasC.idSeccionCurso.idCurso.idUsuario.id == Number(sessionStorage.getItem('id')) && temasC.idEstado.id == 24)
                    }
                  }
                }
              }
            })
          })
        })
      })
    })
  }

  public archivosSeleccionado: any = [];
  selectFiles(event: any): void {
    document.getElementById('validacionArchivoVis')?.setAttribute('style', 'display: none;')
    this.listaContenidoCurso = []
    this.archivosSeleccionado = []
    this.cantidadArchivos = 0
    var existeTiposArchivos = ""
    var obj = {
      files: event.target.files,
      archivos: []
    }
    if(event.target.files.length > 0){
      document.getElementById('snipperAgregarContenidoCurso')?.setAttribute('style', 'display: block;')
      for (let iFileN = 0; iFileN < event.target.files.length; iFileN++) {
        const elementFile = event.target.files[iFileN];
        this.archivosSeleccionado.push(elementFile.name)
        var filtradoContenidosCur = this.listaContenidosCursosConsulta.filter((contenido: any)=> contenido.descripcionArchivo == elementFile.name)
        if(filtradoContenidosCur.length > 0){
          existeTiposArchivos = existeTiposArchivos+'*'+elementFile.name+', '
        }
        if((iFileN+1) == event.target.files.length){
          if(existeTiposArchivos == ''){
            obj.archivos = this.archivosSeleccionado
            this.listaContenidoCurso.push(obj)
            this.cantidadArchivos = event.target.files.length
            document.getElementById('validacionArchivoVis')?.setAttribute('style', 'display: block;')
            document.getElementById('snipperAgregarContenidoCurso')?.setAttribute('style', 'display: none;')
          }else{
            document.getElementById('snipperAgregarContenidoCurso')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Los nombres de archivos ya existen: '+existeTiposArchivos+'!',
              showConfirmButton: false,
              timer: 3500
            })
          }
        }
      }
    }
  }

  existeSeleccion: any = {};
  listarCursoSecciones(itemSeleccionOp: any, seleccionOp: any){
    this.existeSeleccion = {}
    var obj = {
      seleccion: seleccionOp,
      itemSeleccion: itemSeleccionOp
    }
    if(this.listaSelecciones.length > 0){
      var selecciones = this.listaSelecciones.filter((seleccionIt: any) => seleccionIt.seleccion == seleccionOp)
      if(selecciones.length > 0){
        this.existeSeleccion = selecciones[selecciones.length-1]
      }
      if((Object.entries(this.existeSeleccion).length === 0) == true || this.existeSeleccion.itemSeleccion.id != itemSeleccionOp.id){
        if(seleccionOp == 'categoria' && this.listaCursosConsulta.length > 0){
          this.listaCursos = [];
          this.listaSeccionCursos = [];
          this.listaTemasCurso = [];
          if(this.formContenidoCurso.value.curso != null){
            this.formContenidoCurso.controls['curso'].setValue(null);
          }
          if(this.formContenidoCurso.value.seccionCurso != null){
            this.formContenidoCurso.controls['seccionCurso'].setValue(null);
          }
          if(this.formContenidoCurso.value.temaCurso != null){
            this.formContenidoCurso.controls['temaCurso'].setValue(null);
          }
          (this.listaCursosConsulta.filter((cursos: any)=> cursos.idCategoria.id == itemSeleccionOp.id)).filter((cursCons: any)=> this.listaCursos.push(cursCons))
        }else if(seleccionOp == 'curso' && this.listaSeccionCursosConsulta.length > 0){
          this.listaSeccionCursos = [];
          this.listaTemasCurso = [];
          if(this.formContenidoCurso.value.seccionCurso != null){
            this.formContenidoCurso.controls['seccionCurso'].setValue(null);
          }
          if(this.formContenidoCurso.value.temaCurso != null){
            this.formContenidoCurso.controls['temaCurso'].setValue(null);
          }
          (this.listaSeccionCursosConsulta.filter((seccionCurso: any)=> seccionCurso.idCurso.id == itemSeleccionOp.id)).filter((seccionCursoIdCurso: any)=> this.listaSeccionCursos.push(seccionCursoIdCurso))
        }else if(seleccionOp == 'seccionCurso' && this.listaTemasCursosConsulta.length > 0){
          this.listaTemasCurso = [];
          if(this.formContenidoCurso.value.temaCurso != null){
            this.formContenidoCurso.controls['temaCurso'].setValue(null);
          }
          (this.listaTemasCursosConsulta.filter((temaCurso: any)=> temaCurso.idSeccionCurso.id == itemSeleccionOp.id)).filter((seccionTemaCur: any)=> this.listaTemasCurso.push(seccionTemaCur))
        }
      }
    }else{
      this.listaCursos = [];
      if(seleccionOp == 'categoria' && this.listaCursosConsulta.length > 0){
        (this.listaCursosConsulta.filter((cursos: any)=> cursos.idCategoria.id == itemSeleccionOp.id)).filter((cursCons: any)=> this.listaCursos.push(cursCons))
      }
    }
    this.listaSelecciones.push(obj)
  }

  public guardar() {
    console.log(this.listaContenidoCurso, this.formContenidoCurso.value)
    if(this.formContenidoCurso.valid && this.listaContenidoCurso.length > 0){
      document.getElementById('snipperAgregarContenidoCurso')?.setAttribute('style', 'display: block;')
      this.servicioEstado.listarPorId(22).subscribe(resEstadoIde=> {
        for (let iContenidoCur = 0; iContenidoCur < this.listaContenidoCurso[0].archivos.length; iContenidoCur++) {
          const elementContenido = this.listaContenidoCurso[0].archivos[iContenidoCur];
          let contenidoCursoRegistrar : ContenidoCurso = new ContenidoCurso();
          contenidoCursoRegistrar.descripcionArchivo = elementContenido
          contenidoCursoRegistrar.idCurso = this.formContenidoCurso.value.curso
          contenidoCursoRegistrar.idEstado = resEstadoIde
          contenidoCursoRegistrar.idTemaCurso = this.formContenidoCurso.value.temaCurso.id
          contenidoCursoRegistrar.observacion = 'CONTENIDO TEMA CURSO'
          console.log(contenidoCursoRegistrar)
          this.servicioContenidoCurso.registrar(contenidoCursoRegistrar).subscribe(resContenidoCursoReg=>{
            if((iContenidoCur+1) == this.listaContenidoCurso[0].archivos.length){
              this.subirContenidosCurso(this.listaContenidoCurso[0].files)
            }
          }, error => {
            document.getElementById('snipperAgregarContenidoCurso')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Hubo un error al agregar el contenido del curso!',
              showConfirmButton: false,
              timer: 1500
            })
          });
        }
      })
    }else{
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Campos vacios o no ha seleccionado ningun archivo!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  subirContenidosCurso(files: File[]){
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('files',f))
    this.http.post(this.servicioShared.APIUrl+'/Pdf/subirContenidoCurso', formData, {reportProgress: true, observe: 'events'})
      .subscribe((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.percentDone = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.uploadSuccess = true;
        }
        setInterval(() => {
          document.getElementById('snipperAgregarContenidoCurso')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Contenido(s) del curso registrado(s)!',
            showConfirmButton: false,
            timer: 1500
          })
          this.dialogRef.close();
          location.reload();
        }, 30000);
    });
  }

}
