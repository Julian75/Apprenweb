import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EstadoService } from 'src/app/services/estado.service';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { CursoService } from 'src/app/services/curso.service';
import { PreguntaEvaluacionService } from 'src/app/services/preguntaEvaluacion.service';
import { PreguntaEvaluacion } from 'src/app/models/preguntaEvaluacion';
import { SeccionCursoService } from 'src/app/services/seccionCurso.service';
import { TemaCursoService } from 'src/app/services/temaCurso.service';
import { CategoriaService } from 'src/app/services/categoria.service';

@Component({
  selector: 'app-agregar-pregunta-evaluacion',
  templateUrl: './agregar-pregunta-evaluacion.component.html',
  styleUrls: ['./agregar-pregunta-evaluacion.component.css']
})
export class AgregarPreguntaEvaluacionComponent {

  public formPreguntas!: FormGroup;

  public listaSeccionCurso: any = [];
  public listaTemaCurso: any = [];
  public listaCurso: any = [];
  public listaCategorias: any = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AgregarPreguntaEvaluacionComponent>,
    private servicioCurso: CursoService,
    private servicioTemaCurso: TemaCursoService,
    private servicioCategoria: CategoriaService,
    private servicioSeccionCurso: SeccionCursoService,
    private servicioPreguntas: PreguntaEvaluacionService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioEstado: EstadoService,
    @Inject(MAT_DIALOG_DATA) public curso: MatDialog,
  ) { }


  ngOnInit(): void {
    this.crearFormulario();
    if(this.curso != null){
      this.listarSeccionesCurso();
    }else{
      document.getElementById('evaluacion')?.setAttribute('style', 'display: block;')
      document.getElementById('evaluacion2')?.setAttribute('style', 'display: block;')
      this.listarCategorias();
    }
  }

  private crearFormulario() {
    if(this.curso != null){
      this.formPreguntas = this.fb.group({
        id: 0,
        descripcion: [null,Validators.required],
        seccionCurso: [null,Validators.required],
        temaCurso: [null,Validators.required],
      });
    }else{
      this.formPreguntas = this.fb.group({
        id: 0,
        descripcion: [null,Validators.required],
        categoria: [null,Validators.required],
        curso: [null,Validators.required],
        seccionCurso: [null,Validators.required],
        temaCurso: [null,Validators.required],
      });
    }
  }

  public listarCategorias(){
    this.servicioConsultasGenerales.listarCategoriasActivas().subscribe(resCategorias=>{
      this.listaCategorias = resCategorias
    })
  }

  public generarCursos(idCategoria: number){
    this.servicioConsultasGenerales.listarCursoActivosCategoria(idCategoria).subscribe(resCursos=>{
      this.listaCurso = resCursos
    })
  }

  public generarSecciones(idCurso: number){
    this.servicioConsultasGenerales.listarSeccionesCursoActivas(idCurso).subscribe(resSecciones=>{
      this.listaSeccionCurso = resSecciones
    })
  }

  public listarSeccionesCurso(){
    this.servicioConsultasGenerales.listarSeccionesCursoActivas(Number(this.curso)).subscribe(resSecciones=>{
      this.listaSeccionCurso = resSecciones
    })
  }

  public listarTemasCurso(seccion: any){
    this.servicioConsultasGenerales.listarTemasCursoActivas(seccion.id).subscribe(resTemas=>{
      this.listaTemaCurso = resTemas
    })
  }

  public guardar() {
    if(this.formPreguntas.valid){
      document.getElementById('snipper')?.setAttribute('style', 'display: block;')
      this.servicioPreguntas.listarTodos().subscribe(resPreguntas=>{
        var existePregunta = resPreguntas.filter(preguntaEvaluacion => preguntaEvaluacion.descripcion.toUpperCase() == this.formPreguntas.value.descripcion.toUpperCase() && preguntaEvaluacion.idTemaCurso.id == this.formPreguntas.value.temaCurso)
        if(existePregunta.length > 0){
          if(existePregunta[0].idEstado.id == 17){
            document.getElementById('snipper')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Ese pregunta ya existe!',
              showConfirmButton: false,
              timer: 1500
            })
          }else{
            document.getElementById('snipper')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Esa pregunta ya existe, solo que esta inactiva!',
              showConfirmButton: false,
              timer: 1500
            })
          }
        }else{
          this.servicioEstado.listarPorId(17).subscribe(resEstado=>{
            this.servicioTemaCurso.listarPorId(this.formPreguntas.value.temaCurso).subscribe(resTema=>{
              let preguntaEvaluacion : PreguntaEvaluacion = new PreguntaEvaluacion();
              preguntaEvaluacion.idTemaCurso = resTema
              preguntaEvaluacion.descripcion = this.formPreguntas.value.descripcion.toUpperCase()
              preguntaEvaluacion.idEstado = resEstado;
              this.registrarPregunta(preguntaEvaluacion);
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

  public registrarPregunta(preguntaEvaluacion: PreguntaEvaluacion) {
    this.servicioPreguntas.registrar(preguntaEvaluacion).subscribe(res=>{
      document.getElementById('snipper')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Pregunta Registrada!',
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
