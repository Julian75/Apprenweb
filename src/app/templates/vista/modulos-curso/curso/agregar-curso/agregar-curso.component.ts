import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EstadoService } from 'src/app/services/estado.service';
import { CursoService } from 'src/app/services/curso.service';
import { Curso } from 'src/app/models/curso';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { SharedService } from 'src/app/shared.service';
import { HttpEventType, HttpResponse, HttpClient } from '@angular/common/http';
import { ContenidoCurso } from 'src/app/models/contenidoCurso';
import { ContenidoCursoService } from 'src/app/services/contenidoCurso.service';

@Component({
  selector: 'app-agregar-curso',
  templateUrl: './agregar-curso.component.html',
  styleUrls: ['./agregar-curso.component.css']
})
export class AgregarCursoComponent {

  public formCurso!: FormGroup;

  public listaTipoCurso: any = [];
  public listaUsuario: any = [];
  public listaCursosC: any = [];

  //Contenido Curso
  public listaContenidoCurso: any = [];
  public cantidadArchivos: number = 0;
  public percentDone: number = 0;
  public uploadSuccess: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AgregarCursoComponent>,
    private servicioCurso: CursoService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioEstado: EstadoService,
    private servicioUsuario: UsuarioService,
    private servicioCategoria: CategoriaService,
    private servicioContenidoCurso: ContenidoCursoService,
    private servicioShared: SharedService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public curso: MatDialog,
  ) { }


  ngOnInit(): void {
    this.crearFormulario();
    this.listarUsuarios();
    this.listarCategorias();
  }

  private crearFormulario() {
    this.formCurso = this.fb.group({
      id: 0,
      titulo: [null,Validators.required],
      descripcion: [null,Validators.required],
      tipoCurso: [null,Validators.required],
      usuario: [null,Validators.required],
    });
    this.listaCursosC = this.curso
  }

  public listarUsuarios(){
    this.servicioConsultasGenerales.listarUsuariosActivos().subscribe(res=>{
      if(this.listaCursosC[1] == 'curso'){
        this.listaUsuario = res
      }else if(this.listaCursosC[1] == 'mis cursos'){
        this.listaUsuario = res.filter(usuario=> usuario.id == Number(sessionStorage.getItem('id')))
      }
    })
  }

  public listarCategorias(){
    this.servicioConsultasGenerales.listarCategoriasActivas().subscribe(res=>{
      this.listaTipoCurso = res
    })
  }

  public archivosSeleccionado: any = [];
  selectFiles(event: any): void {
    document.getElementById('validacionArchivoVis')?.setAttribute('style', 'display: none;')
    this.listaContenidoCurso = []
    this.archivosSeleccionado = []
    this.cantidadArchivos = 0
    var tiposArchivos = []
    var obj = {
      files: event.target.files,
      archivos: []
    }
    if(event.target.files.length > 0){
      document.getElementById('snipperAgregarCurso')?.setAttribute('style', 'display: block;')
      for (let iFileN = 0; iFileN < event.target.files.length; iFileN++) {
        const elementFile = event.target.files[iFileN];
        var tipoArchivo = elementFile.name.split('.')
        console.log(tipoArchivo)
        tiposArchivos.push(tipoArchivo[tipoArchivo.length-1])
        if((iFileN+1) == event.target.files.length){
          var existeArchivoImagen = tiposArchivos.filter(archivoTip=> archivoTip == 'jpg' || archivoTip == 'jpeg' || archivoTip == 'png' || archivoTip == 'jfif' || archivoTip == 'bmp' || archivoTip == 'tif' || archivoTip == 'tiff')
          if(existeArchivoImagen.length == event.target.files.length){
            for (let iFile = 0; iFile < event.target.files.length; iFile++) {
              const elementFile = event.target.files[iFile];
              this.archivosSeleccionado.push(elementFile.name)
              if((iFile+1) == event.target.files.length){
                obj.archivos = this.archivosSeleccionado
                this.listaContenidoCurso.push(obj)
                this.cantidadArchivos = event.target.files.length
                console.log(this.cantidadArchivos, this.listaContenidoCurso)
                document.getElementById('validacionArchivoVis')?.setAttribute('style', 'display: block;')
                document.getElementById('snipperAgregarCurso')?.setAttribute('style', 'display: none;')
              }
            }
          }else{
            document.getElementById('snipperAgregarCurso')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Todos los archivos seleccionados deben ser imagenes solamente!',
              showConfirmButton: false,
              timer: 1500
            })
          }
        }
      }
    }
  }

  public guardar() {
    if(this.formCurso.valid){
      if(this.listaContenidoCurso.length > 0){
        document.getElementById('snipperAgregarCurso')?.setAttribute('style', 'display: block;')
        var existeCurso = this.listaCursosC[0].filter((curso: any)=>curso.titulo.toUpperCase() == this.formCurso.controls['titulo'].value.toUpperCase() && curso.idCategoria == this.formCurso.value.tipoCurso.id)
        if(existeCurso.length > 0){
          if(existeCurso[0].idEstado.id == 10){
            document.getElementById('snipperAgregarCurso')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Ese curso ya existe!',
              showConfirmButton: false,
              timer: 1500
            })
          }else{
            document.getElementById('snipperAgregarCurso')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Ese curso ya existe, solo que esta inactivo!',
              showConfirmButton: false,
              timer: 1500
            })
          }
        }else{
          this.servicioEstado.listarPorId(10).subscribe(resEstado=>{
            this.servicioUsuario.listarPorId(this.formCurso.value.usuario.id).subscribe(resUsuario=>{
              this.servicioUsuario.listarPorId(this.formCurso.value.usuario.id).subscribe(resUsuario=>{
                this.servicioCategoria.listarPorId(this.formCurso.value.tipoCurso.id).subscribe(resCategoria=>{
                  let curso : Curso = new Curso();
                  curso.titulo = this.formCurso.value.titulo.toUpperCase();
                  curso.descripcion = this.formCurso.value.descripcion.toUpperCase();
                  curso.idCategoria = resCategoria
                  curso.idUsuario = resUsuario
                  curso.idEstado = resEstado;
                  this.registrarCurso(curso);
                })
              })
            })
          })
        }
      }else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'No han seleccionados las imagenes principales!',
          showConfirmButton: false,
          timer: 1500
        })
      }
    }else{
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Los campos estan vacio!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  public registrarCurso(curso: Curso) {
    this.servicioCurso.registrar(curso).subscribe(res=>{
      this.servicioConsultasGenerales.listarCursoRegistrado(curso.titulo, curso.idCategoria.id, curso.descripcion, curso.idUsuario.id, curso.idEstado.id).subscribe(CursoRegistradoRes=>{
        this.servicioCurso.listarPorId(CursoRegistradoRes[0].idCurso).subscribe(cursoIdeRegistrado=>{
          this.servicioEstado.listarPorId(22).subscribe(resEstadoContenido=>{
            for (let iContenidoCursoFile = 0; iContenidoCursoFile < this.listaContenidoCurso[0].archivos.length; iContenidoCursoFile++) {
              const elementContCursF = this.listaContenidoCurso[0].archivos[iContenidoCursoFile];
              let contenidoCursoRegistrar : ContenidoCurso = new ContenidoCurso();
              contenidoCursoRegistrar.descripcionArchivo = elementContCursF
              contenidoCursoRegistrar.idCurso =cursoIdeRegistrado
              contenidoCursoRegistrar.idEstado = resEstadoContenido
              contenidoCursoRegistrar.idTemaCurso = 0
              contenidoCursoRegistrar.observacion = "PRINCIPAL1"
              this.servicioContenidoCurso.registrar(contenidoCursoRegistrar).subscribe(resContenidoCRegistra=>{
                if((iContenidoCursoFile + 1) == this.listaContenidoCurso[0].archivos.length){
                  this.subirImagenesPrincipales(this.listaContenidoCurso[0].files)
                }
              }, error => {
                document.getElementById('snipperAgregarCurso')?.setAttribute('style', 'display: none;')
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'Hubo un error al registrar el contenido del curso!',
                  showConfirmButton: false,
                  timer: 1500
                })
              });
            }
          })
        })
      })
    }, error => {
      document.getElementById('snipperAgregarCurso')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Hubo un error al agregar!',
        showConfirmButton: false,
        timer: 1500
      })
    });
  }

  subirImagenesPrincipales(files: File[]){
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('files',f))
    this.http.post(this.servicioShared.APIUrl+'/Pdf/subirContenidoCurso', formData, {reportProgress: true, observe: 'events'})
      .subscribe((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.percentDone = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.uploadSuccess = true;
        }
        setTimeout(() => {
          document.getElementById('snipperAgregarCurso')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Curso Registrado!',
            showConfirmButton: false,
            timer: 1500
          })
          this.dialogRef.close();
          location.reload();
        }, 3000);
    });
  }
}
