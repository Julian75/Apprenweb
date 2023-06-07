import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PreguntaEvaluacionModificar } from 'src/app/models-actualizar/preguntaEvaluacionModificar';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { EstadoService } from 'src/app/services/estado.service';
import { ModificarService } from 'src/app/services/modificar.service';
import { PreguntaEvaluacionService } from 'src/app/services/preguntaEvaluacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-pregunta-evaluacion',
  templateUrl: './modificar-pregunta-evaluacion.component.html',
  styleUrls: ['./modificar-pregunta-evaluacion.component.css']
})
export class ModificarPreguntaEvaluacionComponent {

  public formPregunta!: FormGroup;
  public listaEstados: any = [];
  public listaPreguntaEvaluacion: any = [];
  public listaSeccionCurso: any = [];
  public listaTemaCurso: any = [];
  public listaCurso: any = [];
  public listaCategorias: any = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModificarPreguntaEvaluacionComponent>,
    private servicioEstado : EstadoService,
    private servicioPreguntaEvaluacion : PreguntaEvaluacionService,
    private servicioModificar : ModificarService,
    private servicioConsultasGenerales : ConsultasGeneralesService,
    @Inject(MAT_DIALOG_DATA) public preguntaEvaluacion: MatDialog,
 ) { }

  ngOnInit(): void {
    this.listaPreguntaEvaluacion = this.preguntaEvaluacion;
    this.crearFormulario();
    this.listarEstados();
    this.listarIdPreguntaEvaluacion();
    if(this.listaPreguntaEvaluacion[2] != null){
      this.listarSeccionesCurso()
    }else{
      document.getElementById('evaluacion')?.setAttribute('style', 'display: block;')
      document.getElementById('evaluacion2')?.setAttribute('style', 'display: block;')
      this.listarCategorias();
    }
  }

  private crearFormulario() {
    if(this.listaPreguntaEvaluacion[2] != null){
      this.formPregunta = this.fb.group({
        id: 0,
        descripcion: [null,Validators.required],
        estado: [null,Validators.required],
        seccionCurso: [null,Validators.required],
        temaCurso: [null,Validators.required],
      });
    }else{
      this.formPregunta = this.fb.group({
        id: 0,
        descripcion: [null,Validators.required],
        estado: [null,Validators.required],
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
      this.servicioConsultasGenerales.listarCursoActivosCategoria(this.listaPreguntaEvaluacion[0].idTemaCurso.idSeccionCurso.idCurso.id).subscribe(resCursos=>{
        this.listaCurso = resCursos
        this.servicioConsultasGenerales.listarSeccionesCursoActivas(Number(this.listaPreguntaEvaluacion[0].idTemaCurso.idSeccionCurso.idCurso.id)).subscribe(resSecciones=>{
          this.listaSeccionCurso = resSecciones
          this.servicioConsultasGenerales.listarTemasCursoActivas(this.listaPreguntaEvaluacion[0].idTemaCurso.idSeccionCurso.id).subscribe(resTemas=>{
            this.listaTemaCurso = resTemas
          })
        })
      })
    })
  }

  public generarCursos(idCategoria: number){
    this.servicioConsultasGenerales.listarCursoActivosCategoria(idCategoria).subscribe(resCursos=>{
      this.listaCurso = resCursos
      this.formPregunta.controls['curso'].setValue(null);
    })
  }

  public generarSecciones(idCurso: number){
    this.servicioConsultasGenerales.listarSeccionesCursoActivas(idCurso).subscribe(resSecciones=>{
      this.listaSeccionCurso = resSecciones
      this.formPregunta.controls['seccionCurso'].setValue(null);
    })
  }

  public listarSeccionesCurso(){
    this.listaPreguntaEvaluacion = this.preguntaEvaluacion;
    this.servicioConsultasGenerales.listarSeccionesCursoActivas(Number(this.listaPreguntaEvaluacion[0].idTemaCurso.idSeccionCurso.idCurso.id)).subscribe(resSecciones=>{
      this.listaSeccionCurso = resSecciones
      this.servicioConsultasGenerales.listarTemasCursoActivas(this.listaPreguntaEvaluacion[0].idTemaCurso.idSeccionCurso.id).subscribe(resTemas=>{
        this.listaTemaCurso = resTemas
      })
    })
  }

  public listarTemasCurso(seccion: any){
    this.servicioConsultasGenerales.listarTemasCursoActivas(seccion.id).subscribe(resTemas=>{
      this.listaTemaCurso = resTemas
      this.formPregunta.controls['temaCurso'].setValue(null);
    })
  }

  public listarEstados() {
    this.servicioConsultasGenerales.listarEstadosIdModulo(10).subscribe(resEstados=>{
      this.listaEstados = resEstados;
    })
  }

  public listarIdPreguntaEvaluacion() {
    this.listaPreguntaEvaluacion = this.preguntaEvaluacion;
    this.formPregunta.controls['id'].setValue(this.listaPreguntaEvaluacion[0].id);
    this.formPregunta.controls['seccionCurso'].setValue(this.listaPreguntaEvaluacion[0].idTemaCurso.idSeccionCurso.id);
    this.formPregunta.controls['temaCurso'].setValue(this.listaPreguntaEvaluacion[0].idTemaCurso.id);
    this.formPregunta.controls['descripcion'].setValue(this.listaPreguntaEvaluacion[0].descripcion);
    this.formPregunta.controls['estado'].setValue(this.listaPreguntaEvaluacion[0].idEstado.id);
    if(this.listaPreguntaEvaluacion[2] == null){
      this.formPregunta.controls['categoria'].setValue(this.listaPreguntaEvaluacion[0].idTemaCurso.idSeccionCurso.idCurso.idCategoria.id);
      this.formPregunta.controls['curso'].setValue(this.listaPreguntaEvaluacion[0].idTemaCurso.idSeccionCurso.idCurso.id);
    }
  }

  public guardar() {
    if(this.formPregunta.valid){
      document.getElementById('snipper')?.setAttribute('style', 'display: block;')
      if(this.listaPreguntaEvaluacion[2] != null){
        var existePreguntaEvaluacion = this.listaPreguntaEvaluacion[1].filter((pregunta:any)=> pregunta.id != this.listaPreguntaEvaluacion[0].id && pregunta.descripcion.toUpperCase() == this.formPregunta.value.descripcion.toUpperCase() && pregunta.idTemaCurso == this.formPregunta.value.temaCurso)
        var igualPreguntaEvaluacion = this.listaPreguntaEvaluacion[1].filter((pregunta:any)=> pregunta.id == this.listaPreguntaEvaluacion[0].id && pregunta.descripcion.toUpperCase() == this.formPregunta.value.descripcion.toUpperCase() && pregunta.idTemaCurso == this.formPregunta.value.temaCurso && pregunta.idEstado == this.formPregunta.value.estado)
      }else{
        var existePreguntaEvaluacion = this.listaPreguntaEvaluacion[1].filter((pregunta:any)=> pregunta.id != this.listaPreguntaEvaluacion[0].id && pregunta.descripcion.toUpperCase() == this.formPregunta.value.descripcion.toUpperCase() && pregunta.idTemaCurso.id == this.formPregunta.value.temaCurso)
        var igualPreguntaEvaluacion = this.listaPreguntaEvaluacion[1].filter((pregunta:any)=> pregunta.id == this.listaPreguntaEvaluacion[0].id && pregunta.descripcion.toUpperCase() == this.formPregunta.value.descripcion.toUpperCase() && pregunta.idTemaCurso.id == this.formPregunta.value.temaCurso && pregunta.idEstado == this.formPregunta.value.estado)
      }
      if(igualPreguntaEvaluacion.length > 0){
        document.getElementById('snipper')?.setAttribute('style', 'display: none;')
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'No hubieron cambios!',
          showConfirmButton: false,
          timer: 1500
        })
        this.dialogRef.close()
      }else if(existePreguntaEvaluacion.length > 0){
        if(this.listaPreguntaEvaluacion[2] != null){
          if(existePreguntaEvaluacion[0].idEstado == 17){
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
          if(existePreguntaEvaluacion[0].idEstado.id == 17){
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
        }
      }else{
        let modificarPregunta : PreguntaEvaluacionModificar = new PreguntaEvaluacionModificar();
        modificarPregunta.id = this.listaPreguntaEvaluacion[0].id
        modificarPregunta.descripcion = this.formPregunta.value.descripcion.toUpperCase()
        modificarPregunta.idTemaCurso = this.formPregunta.value.temaCurso
        modificarPregunta.idEstado = this.formPregunta.value.estado
        this.actualizarPreguntaEvaluacion(modificarPregunta)
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

  private actualizarPreguntaEvaluacion(modificarPregunta :PreguntaEvaluacionModificar){
    this.servicioModificar.actualizarPreguntaEvaluacion(modificarPregunta).subscribe(res => {
      document.getElementById('snipper')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Pregunta modificada!',
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
