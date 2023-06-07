import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CursoModificar } from 'src/app/models-actualizar/cursoModificar';
import { ContenidoCurso } from 'src/app/models/contenidoCurso';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { ContenidoCursoService } from 'src/app/services/contenidoCurso.service';
import { CursoService } from 'src/app/services/curso.service';
import { EstadoService } from 'src/app/services/estado.service';
import { ModificarService } from 'src/app/services/modificar.service';
import { SharedService } from 'src/app/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-curso',
  templateUrl: './modificar-curso.component.html',
  styleUrls: ['./modificar-curso.component.css']
})
export class ModificarCursoComponent {

  public formCurso!: FormGroup;
  public listaEstados: any = [];
  public listaCurso: any = [];
  public listaUsuario: any = [];
  public listaTipoCurso: any = [];

  //Imagen de archivos
  fullscreen: boolean = false;
  imageIndex1: number = 0;
  listaFotosCurso: any = [];

  //Contenido Curso
  public listaContenidoCurso: any = [];
  public cantidadArchivos: number = 0;
  public percentDone: number = 0;
  public uploadSuccess: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModificarCursoComponent>,
    private servicioEstado : EstadoService,
    private servicioCurso : CursoService,
    private servicioModificar : ModificarService,
    private servicioContenidoCurso: ContenidoCursoService,
    private servicioConsultasGenerales : ConsultasGeneralesService,
    @Inject(MAT_DIALOG_DATA) public curso: MatDialog,
    private servicioShared: SharedService,
    private http: HttpClient,
 ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.listarEstados();
    this.listarCategorias();
    this.listarUsuarios();
    this.listarIdCurso();
  }

  private crearFormulario() {
    this.formCurso = this.fb.group({
      id: 0,
      titulo: [null,Validators.required],
      descripcion: [null,Validators.required],
      tipoCurso: [null,Validators.required],
      usuario: [null,Validators.required],
      estado: [null,Validators.required],
    });
  }

  public archivosSeleccionado: any = [];
  public tiposArchivos: any = [];
  selectFiles(event: any): void {
    document.getElementById('validacionArchivoVis')?.setAttribute('style', 'display: none;')
    this.listaContenidoCurso = []
    this.archivosSeleccionado = []
    this.cantidadArchivos = 0
    this.tiposArchivos = []
    var existeAlgunArchivoIgual = []
    var archivosAlmacenados = "";
    var obj = {
      files: event.target.files,
      archivos: []
    }
    if(event.target.files.length > 0){
      document.getElementById('snipperModificarCursoModificarCurso')?.setAttribute('style', 'display: block;')
      this.servicioContenidoCurso.listarTodos().subscribe(resContenidosCursosTodos=>{
        for (let iFileN = 0; iFileN < event.target.files.length; iFileN++) {
          const elementFile = event.target.files[iFileN];
          var tipoArchivo = elementFile.name.split('.')
          console.log(tipoArchivo)
          this.tiposArchivos.push(tipoArchivo[tipoArchivo.length-1])
          if((iFileN+1) == event.target.files.length){
            var existeArchivoImagen = this.tiposArchivos.filter((archivoTip: any)=> archivoTip == 'jpg' || archivoTip == 'jpeg' || archivoTip == 'png' || archivoTip == 'jfif' || archivoTip == 'bmp' || archivoTip == 'tif' || archivoTip == 'tiff')
            if(existeArchivoImagen.length == event.target.files.length){
              this.servicioContenidoCurso.listarTodos().subscribe(resContenidosCursosTodos=>{
                for (let iFile = 0; iFile < event.target.files.length; iFile++) {
                  const elementFile = event.target.files[iFile];
                  this.archivosSeleccionado.push(elementFile.name)
                  if((iFile+1) == event.target.files.length){
                    resContenidosCursosTodos.filter(contExistente=>{
                      var archivosAlm = this.archivosSeleccionado.filter((nomArchivo: any)=> nomArchivo == contExistente.descripcionArchivo)
                      if(archivosAlm.length > 0){
                        archivosAlm.filter((archivoCap: any)=> {
                          existeAlgunArchivoIgual.push(archivoCap)
                          archivosAlmacenados = archivosAlmacenados+" *"+archivoCap
                        })
                      }
                    })
                    if(existeAlgunArchivoIgual.length > 0){
                      document.getElementById('snipperModificarCursoModificarCurso')?.setAttribute('style', 'display: none;')
                      Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Los siguientes nombres de archivos ya existen almacenados: '+archivosAlmacenados,
                        showConfirmButton: false,
                        timer: 3000
                      })
                    }else{
                      obj.archivos = this.archivosSeleccionado
                      this.listaContenidoCurso.push(obj)
                      this.cantidadArchivos = event.target.files.length
                      console.log(this.cantidadArchivos, this.listaContenidoCurso)
                      document.getElementById('validacionArchivoVis')?.setAttribute('style', 'display: block;')
                      document.getElementById('snipperModificarCursoModificarCurso')?.setAttribute('style', 'display: none;')
                    }
                  }
                }
              })
            }else{
              document.getElementById('snipperModificarCursoModificarCurso')?.setAttribute('style', 'display: none;')
              Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Todos los archivos seleccionados deben ser imagenes solamente, si desea modificarlos!',
                showConfirmButton: false,
                timer: 1500
              })
            }
          }
        }
      })
    }
  }

  public listarUsuarios(){
    this.servicioConsultasGenerales.listarUsuariosActivos().subscribe(res=>{
      if(this.listaCurso[2] == 'curso'){
        this.listaUsuario = res
      }else if(this.listaCurso[2] == 'mis cursos'){
        this.listaUsuario = res.filter(usuario=> usuario.id == Number(sessionStorage.getItem('id')))
      }
    })
  }

  public listarCategorias(){
    this.servicioConsultasGenerales.listarCategoriasActivas().subscribe(res=>{
      this.listaTipoCurso = res
    })
  }

  public listarEstados() {
    this.servicioConsultasGenerales.listarEstadosIdModulo(7).subscribe(resEstados=>{
      this.listaEstados = resEstados;
    })
  }

  listaIndexContenidosPrincipales: any = []
  indexAltoContenido: number = 0;
  public listarIdCurso() {
    this.listaCurso = this.curso;
    this.listaFotosCurso = []
    this.listaIndexContenidosPrincipales = []
    this.indexAltoContenido = 0
    this.formCurso.controls['id'].setValue(this.listaCurso[0].idCurso);
    this.formCurso.controls['titulo'].setValue(this.listaCurso[0].titulo);
    this.formCurso.controls['descripcion'].setValue(this.listaCurso[0].descripcion);
    this.formCurso.controls['usuario'].setValue(this.listaCurso[0].idUsuario);
    this.formCurso.controls['tipoCurso'].setValue(this.listaCurso[0].idCategoria);
    this.formCurso.controls['estado'].setValue(this.listaCurso[0].idEstado);
    this.servicioConsultasGenerales.listarContenidoCursoIdCurso(this.listaCurso[0].idCurso).subscribe(resContenidosCursoIde=>{
      if(resContenidosCursoIde.length > 0){
        resContenidosCursoIde.filter(contCurso=> {
          var index = contCurso.observacion.replace('PRINCIPAL', '')
          this.listaIndexContenidosPrincipales.push(index)
        })
        console.log(resContenidosCursoIde)
        this.indexAltoContenido = Math.max(...this.listaIndexContenidosPrincipales);
        console.log(this.indexAltoContenido, this.listaIndexContenidosPrincipales, resContenidosCursoIde);
        (resContenidosCursoIde.filter(contCurs=> contCurs.observacion == 'PRINCIPAL'+Math.max(...this.listaIndexContenidosPrincipales))).filter((contObt: any)=> this.listaFotosCurso.push('assets/contenido-curso/'+contObt.descripcionArchivo))
        console.log(this.listaFotosCurso, resContenidosCursoIde, this.listaIndexContenidosPrincipales)
      }
    })
  }

  public guardar() {
    if(this.formCurso.valid){
      document.getElementById('snipperModificarCurso')?.setAttribute('style', 'display: block;')
      var existeCurso = this.listaCurso[1].filter((curso:any)=> curso.id != this.listaCurso[0].idCurso && curso.titulo.toUpperCase() == this.formCurso.value.titulo.toUpperCase() && curso.idCategoria.id == this.formCurso.value.tipoCurso)
      var igualCurso = this.listaCurso[1].filter((curso:any)=> curso.id == this.listaCurso[0].idCurso && curso.titulo.toUpperCase() == this.formCurso.value.titulo.toUpperCase() && curso.idEstado.id == this.formCurso.value.estado && curso.idCategoria.id == this.formCurso.value.tipoCurso)
      if(igualCurso.length > 0 && this.listaContenidoCurso.length == 0){
        document.getElementById('snipperModificarCurso')?.setAttribute('style', 'display: none;')
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'No hubieron cambios!',
          showConfirmButton: false,
          timer: 1500
        })
        this.dialogRef.close()
      }else if(existeCurso.length > 0){
        if(existeCurso[0].idEstado.id == 10){
          document.getElementById('snipperModificarCurso')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ya existe este curso!',
            showConfirmButton: false,
            timer: 1500
          })
        }else{
          document.getElementById('snipperModificarCurso')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ya existe este curso, solo que esta inactivo!',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }else{
        let cursoModificar : CursoModificar = new CursoModificar();
        cursoModificar.id = this.listaCurso[0].idCurso
        cursoModificar.titulo = this.formCurso.value.titulo.toUpperCase()
        cursoModificar.descripcion = this.formCurso.value.descripcion.toUpperCase()
        cursoModificar.idCategoria = this.formCurso.value.tipoCurso
        cursoModificar.idUsuario = this.formCurso.value.usuario
        cursoModificar.idEstado = this.formCurso.value.estado
        this.actualizarCurso(cursoModificar)
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

  private actualizarCurso(cursoModificar :CursoModificar){
    this.servicioModificar.actualizarCurso(cursoModificar).subscribe(res => {
      if(this.listaContenidoCurso.length > 0){
        this.servicioEstado.listarPorId(22).subscribe(resEstadoContenido=>{
          this.servicioCurso.listarPorId(Number(this.listaCurso[0].idCurso)).subscribe(resCursoIde=>{
            for (let iContenidoCursoFile = 0; iContenidoCursoFile < this.listaContenidoCurso[0].archivos.length; iContenidoCursoFile++) {
              const elementContCursF = this.listaContenidoCurso[0].archivos[iContenidoCursoFile];
              let contenidoCursoRegistrar : ContenidoCurso = new ContenidoCurso();
              contenidoCursoRegistrar.descripcionArchivo = elementContCursF
              contenidoCursoRegistrar.idCurso = resCursoIde
              contenidoCursoRegistrar.idEstado = resEstadoContenido
              contenidoCursoRegistrar.idTemaCurso = 0
              contenidoCursoRegistrar.observacion = "PRINCIPAL"+(this.indexAltoContenido+1)
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
      }else{
        document.getElementById('snipperModificarCurso')?.setAttribute('style', 'display: none;')
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Curso modificada!',
          showConfirmButton: false,
          timer: 1500
        })
        this.dialogRef.close();
        location.reload();
      }
    }, error => {
      document.getElementById('snipperModificarCurso')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Hubo un error al modificar!',
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
        setInterval(() => {
          document.getElementById('snipperModificarCurso')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Curso modificada!',
            showConfirmButton: false,
            timer: 1500
          })
          this.dialogRef.close();
          location.reload();
        }, 3000);
    });
  }
}
