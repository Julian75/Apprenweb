import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CursoEstudianteModificar } from 'src/app/models-actualizar/cursoEstudianteModificar';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { CursoEstudianteService } from 'src/app/services/cursoEstudiante.service';
import { EstadoService } from 'src/app/services/estado.service';
import { ModificarService } from 'src/app/services/modificar.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-curso-estudiante',
  templateUrl: './modificar-curso-estudiante.component.html',
  styleUrls: ['./modificar-curso-estudiante.component.css']
})
export class ModificarCursoEstudianteComponent {

  public formCursoEstudiante!: FormGroup;
  public listaEstados: any = [];
  public listaCursoEstudiante: any = [];
  public listaUsuario: any = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModificarCursoEstudianteComponent>,
    private servicioEstado : EstadoService,
    private ServicioCursoEstudiante : CursoEstudianteService,
    private servicioModificar : ModificarService,
    private servicioConsultasGenerales : ConsultasGeneralesService,
    @Inject(MAT_DIALOG_DATA) public cursoEstudiante: MatDialog,
 ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.listarEstados();
    this.listarIdCursoEstudiante();
    this.listarUsuarios();
  }

  private crearFormulario() {
    this.formCursoEstudiante = this.fb.group({
      id: 0,
      usuario: [null,Validators.required],
      estado: [null,Validators.required],
    });
  }

  public listarUsuarios(){
    this.servicioConsultasGenerales.listarUsuariosActivos().subscribe(res=>{
      this.listaUsuario = res
    })
  }

  public listarEstados() {
    this.listaCursoEstudiante = this.cursoEstudiante;
    this.servicioConsultasGenerales.listarEstadosIdModulo(9).subscribe(resEstados=>{
      if(this.listaCursoEstudiante[0].idEstado.id == 14){
        this.listaEstados = resEstados;
      }else if(this.listaCursoEstudiante[0].idEstado.id == 15){
        this.listaEstados = resEstados.filter(estados=> estados.id != 14);
      }
    })
  }

  public listarIdCursoEstudiante() {
    this.listaCursoEstudiante = this.cursoEstudiante;
    this.formCursoEstudiante.controls['id'].setValue(this.listaCursoEstudiante[0].id);
    this.formCursoEstudiante.controls['usuario'].setValue(this.listaCursoEstudiante[0].idUsuario.id);
    this.formCursoEstudiante.controls['estado'].setValue(this.listaCursoEstudiante[0].idEstado.id);
  }

  public guardar() {
    if(this.formCursoEstudiante.valid){
      document.getElementById('snipper')?.setAttribute('style', 'display: block;')
      var existeCursoEstudiante = this.listaCursoEstudiante[1].filter((cursoEstudiante:any)=> cursoEstudiante.id != this.listaCursoEstudiante[0].id && cursoEstudiante.idUsuario.id == this.formCursoEstudiante.value.usuario)
      var igualCursoEstudiante = this.listaCursoEstudiante[1].filter((cursoEstudiante:any)=> cursoEstudiante.id == this.listaCursoEstudiante[0].id && cursoEstudiante.idUsuario.id == this.formCursoEstudiante.value.usuario && cursoEstudiante.idEstado.id == this.formCursoEstudiante.value.estado)
      if(igualCursoEstudiante.length > 0){
        document.getElementById('snipper')?.setAttribute('style', 'display: none;')
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'No hubieron cambios!',
          showConfirmButton: false,
          timer: 1500
        })
        this.dialogRef.close()
      }else if(existeCursoEstudiante.length > 0){
        if(existeCursoEstudiante[0].idEstado.id == 14){
          document.getElementById('snipper')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ese estudiante ya esta inscrito en este curso!',
            showConfirmButton: false,
            timer: 1500
          })
        }else if(existeCursoEstudiante[0].idEstado.id == 15){
          document.getElementById('snipper')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ese estudiante ya esta realizando este curso!',
            showConfirmButton: false,
            timer: 1500
          })
        }else if(existeCursoEstudiante[0].idEstado.id == 16){
          document.getElementById('snipper')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ese estudiante ya finalizo este curso!',
            showConfirmButton: false,
            timer: 1500
          })
        }else if(existeCursoEstudiante[0].idEstado.id == 21){
          let cursoEstudianteModificar : CursoEstudianteModificar = new CursoEstudianteModificar();
          cursoEstudianteModificar.id = this.listaCursoEstudiante[0].id
          cursoEstudianteModificar.fecha = this.listaCursoEstudiante[0].fecha
          cursoEstudianteModificar.idCurso = this.listaCursoEstudiante[0].idCurso.id
          cursoEstudianteModificar.idUsuario = this.formCursoEstudiante.value.usuario
          cursoEstudianteModificar.idEstado = this.formCursoEstudiante.value.estado
          this.actualizarCursoEstudiante(cursoEstudianteModificar)
        }
      }else{
        let cursoEstudianteModificar : CursoEstudianteModificar = new CursoEstudianteModificar();
        cursoEstudianteModificar.id = this.listaCursoEstudiante[0].id
        cursoEstudianteModificar.fecha = this.listaCursoEstudiante[0].fecha
        cursoEstudianteModificar.idCurso = this.listaCursoEstudiante[0].idCurso.id
        cursoEstudianteModificar.idUsuario = this.formCursoEstudiante.value.usuario
        cursoEstudianteModificar.idEstado = this.formCursoEstudiante.value.estado
        this.actualizarCursoEstudiante(cursoEstudianteModificar)
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

  private actualizarCursoEstudiante(cursoEstudianteModificar :CursoEstudianteModificar){
    this.servicioModificar.actualizarCursoEstudiante(cursoEstudianteModificar).subscribe(res => {
      document.getElementById('snipper')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Estudiante del Curso modificado!',
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
