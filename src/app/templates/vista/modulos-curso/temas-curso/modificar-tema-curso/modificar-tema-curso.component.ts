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
import { HttpClient } from '@angular/common/http';
import { TemaCurso } from 'src/app/models/temaCurso';
import { TemaCursoService } from 'src/app/services/temaCurso.service';
import { SeccionCursoService } from 'src/app/services/seccionCurso.service';
import { TemaCursoModificar } from 'src/app/models-actualizar/temaCursoModificar';
import { ModificarService } from 'src/app/services/modificar.service';

@Component({
  selector: 'app-modificar-tema-curso',
  templateUrl: './modificar-tema-curso.component.html',
  styleUrls: ['./modificar-tema-curso.component.css']
})
export class ModificarTemaCursoComponent {

  public formTemaCurso!: FormGroup;
  public listaTemaCursosTodos: any = []
  public listaCategorias: any = []
  public listaEstados: any = []
  public listaCursos: any = []
  public listaSeccionCursos: any = []
  public listaCursosConsulta: any = []
  public listaSeccionCursosConsulta: any = []
  public listaSelecciones: any = []

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModificarTemaCursoComponent>,
    private servicioCurso: CursoService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioUsuario: UsuarioService,
    private servicioSeccionCurso: SeccionCursoService,
    private servicioModificar: ModificarService,
    @Inject(MAT_DIALOG_DATA) public temasCursos: MatDialog,
  ) { }


  ngOnInit(): void {
    this.listaSelecciones = []
    this.crearFormulario();
    this.listarCategorias();
    this.listarEstados();
    this.listarCurso();
  }

  private crearFormulario() {
    this.formTemaCurso = this.fb.group({
      id: 0,
      descripcion: [null,Validators.required],
      categoria: [null,Validators.required],
      curso: [null,Validators.required],
      seccionCurso: [null,Validators.required],
      evaluacion: [null,Validators.required],
      estado: [null,Validators.required]
    });
    this.listaTemaCursosTodos = this.temasCursos
  }

  public listarCategorias(){
    this.servicioConsultasGenerales.listarCategoriasActivas().subscribe(res=>{
      this.listaCategorias = res
    })
  }

  public listarCurso(){
    this.servicioCurso.listarTodos().subscribe(resCursosTodos=> {
      this.servicioSeccionCurso.listarTodos().subscribe(resSeccionesCurso=> {
        this.servicioUsuario.listarPorId(Number(sessionStorage.getItem('id'))).subscribe(resUsuarioIde=> {
          this.listaCursosConsulta = resCursosTodos;
          this.listaSeccionCursosConsulta = resSeccionesCurso
          if(resUsuarioIde.idRol.id != 1){
            if(resCursosTodos.length > 0){
              this.listaCursosConsulta = resCursosTodos.filter(curs=> curs.idUsuario.id == Number(sessionStorage.getItem('id')));
              if(resSeccionesCurso.length > 0){
                this.listaSeccionCursosConsulta = resSeccionesCurso.filter(seccionC=> seccionC.idCurso.idUsuario.id == Number(sessionStorage.getItem('id')))
              }
            }
          }
          this.listarPorIdTemaCurso();
        })
      })
    })
  }

  public listarEstados(){
    this.servicioConsultasGenerales.listarEstadosIdModulo(13).subscribe(resEstados=>{
      this.listaEstados = resEstados
    })
  }

  public listarPorIdTemaCurso(){
    (this.listaCursosConsulta.filter((cursos: any)=> cursos.idCategoria.id == this.listaTemaCursosTodos[0].idSeccionCurso.idCurso.idCategoria.id)).filter((cursCons: any)=> this.listaCursos.push(cursCons));
    (this.listaSeccionCursosConsulta.filter((seccionCurso: any)=> seccionCurso.idCurso.id == this.listaTemaCursosTodos[0].idSeccionCurso.idCurso.id)).filter((seccionCursoIdCurso: any)=> this.listaSeccionCursos.push(seccionCursoIdCurso));    this.formTemaCurso.controls['id'].setValue(this.listaTemaCursosTodos[0].id);
    this.formTemaCurso.controls['descripcion'].setValue(this.listaTemaCursosTodos[0].descripcion);
    this.formTemaCurso.controls['categoria'].setValue(this.listaTemaCursosTodos[0].idSeccionCurso.idCurso.idCategoria.id);
    this.formTemaCurso.controls['curso'].setValue(this.listaTemaCursosTodos[0].idSeccionCurso.idCurso.id);
    this.formTemaCurso.controls['seccionCurso'].setValue(this.listaTemaCursosTodos[0].idSeccionCurso.id);
    this.formTemaCurso.controls['evaluacion'].setValue(this.listaTemaCursosTodos[0].evaluacion);
    this.formTemaCurso.controls['estado'].setValue(this.listaTemaCursosTodos[0].idEstado.id);
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
          if(this.formTemaCurso.value.curso != null){
            this.formTemaCurso.controls['curso'].setValue(null);
          }
          if(this.formTemaCurso.value.seccionCurso != null){
            this.formTemaCurso.controls['seccionCurso'].setValue(null);
          }
          (this.listaCursosConsulta.filter((cursos: any)=> cursos.idCategoria.id == itemSeleccionOp.id)).filter((cursCons: any)=> this.listaCursos.push(cursCons))
        }else if(seleccionOp == 'curso' && this.listaSeccionCursosConsulta.length > 0){
          this.listaSeccionCursos = [];
          if(this.formTemaCurso.value.seccionCurso != null){
            this.formTemaCurso.controls['seccionCurso'].setValue(null);
          }
          (this.listaSeccionCursosConsulta.filter((seccionCurso: any)=> seccionCurso.idCurso.id == itemSeleccionOp.id)).filter((seccionCursoIdCurso: any)=> this.listaSeccionCursos.push(seccionCursoIdCurso))
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
    if(this.formTemaCurso.valid){
      document.getElementById('snipperModificarTemaCurso')?.setAttribute('style', 'display: block;')
      var existeTemaCurso : any = []
      var sinCambioTemaCurso : any = []
      if(this.listaTemaCursosTodos.length > 0){
        existeTemaCurso = this.listaTemaCursosTodos[1].filter((temCur: any)=> temCur.id != this.listaTemaCursosTodos[0].id && temCur.descripcion.toUpperCase() == this.formTemaCurso.value.descripcion.toUpperCase() && temCur.idSeccionCurso.id == this.formTemaCurso.value.seccionCurso)
        sinCambioTemaCurso = this.listaTemaCursosTodos[1].filter((temCur: any)=> temCur.id == this.listaTemaCursosTodos[0].id && temCur.descripcion.toUpperCase() == this.formTemaCurso.value.descripcion.toUpperCase() && temCur.idSeccionCurso.id == this.formTemaCurso.value.seccionCurso && temCur.idEstado.id == this.formTemaCurso.value.estado && temCur.evaluacion == this.formTemaCurso.value.evaluacion)
      }
      if(sinCambioTemaCurso.length > 0){
        document.getElementById('snipperModificarTemaCurso')?.setAttribute('style', 'display: none;')
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'No hubieron cambios!',
          showConfirmButton: false,
          timer: 1500
        })
        location.reload()
        this.dialogRef.close()
      }else{
        if(existeTemaCurso.length > 0){
          if(existeTemaCurso[0].idEstado.id == 24){
            document.getElementById('snipperModificarTemaCurso')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Ese Tema de curso ya existe!',
              showConfirmButton: false,
              timer: 1500
            })
          }else{
            document.getElementById('snipperModificarTemaCurso')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Ese tema de curso ya existe, solo que esta inactivo!',
              showConfirmButton: false,
              timer: 1500
            })
          }
        }else{
          let temaCursoModificar : TemaCursoModificar = new TemaCursoModificar();
          temaCursoModificar.id = this.listaTemaCursosTodos[0].id
          temaCursoModificar.descripcion = this.formTemaCurso.value.descripcion.toUpperCase()
          temaCursoModificar.idSeccionCurso = this.formTemaCurso.value.seccionCurso
          temaCursoModificar.evaluacion = this.formTemaCurso.value.evaluacion
          temaCursoModificar.idEstado = this.formTemaCurso.value.estado
          this.modificarTemaCurso(temaCursoModificar);
        }
      }
    }else{
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Campos Vacios!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  public modificarTemaCurso(temaCursoModificar: TemaCursoModificar) {
    this.servicioModificar.actualizarTemaCurso(temaCursoModificar).subscribe(resTemaCursoModificado=>{
      document.getElementById('snipperModificarTemaCurso')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se Modifico correctamente el tema del curso!',
        showConfirmButton: false,
        timer: 1500
      })
      location.reload()
      this.dialogRef.close()
    }, error => {
      document.getElementById('snipperModificarTemaCurso')?.setAttribute('style', 'display: none;')
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
