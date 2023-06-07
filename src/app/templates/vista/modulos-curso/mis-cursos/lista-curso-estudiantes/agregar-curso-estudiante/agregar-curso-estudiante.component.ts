import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EstadoService } from 'src/app/services/estado.service';
import { CursoEstudianteService } from 'src/app/services/cursoEstudiante.service';
import { CursoEstudiante } from 'src/app/models/cursoEstudiante';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { CursoService } from 'src/app/services/curso.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as moment from 'moment';

@Component({
  selector: 'app-agregar-curso-estudiante',
  templateUrl: './agregar-curso-estudiante.component.html',
  styleUrls: ['./agregar-curso-estudiante.component.css']
})
export class AgregarCursoEstudianteComponent {

  public formCursoEstudiante!: FormGroup;

  public listaUsuario: any = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AgregarCursoEstudianteComponent>,
    private servicioCurso: CursoService,
    private servicioUsuario: UsuarioService,
    private servicioCursoEstudiante: CursoEstudianteService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioEstado: EstadoService,
    @Inject(MAT_DIALOG_DATA) public curso: MatDialog,
  ) { }


  ngOnInit(): void {
    this.crearFormulario();
    this.listarUsuarios();
  }

  private crearFormulario() {
    this.formCursoEstudiante = this.fb.group({
      id: 0,
      usuario: [null,Validators.required],
    });
  }

  public listarUsuarios(){
    this.servicioConsultasGenerales.listarUsuariosActivos().subscribe(res=>{
      this.listaUsuario = res
    })
  }

  public guardar() {
    if(this.formCursoEstudiante.valid){
      document.getElementById('snipper')?.setAttribute('style', 'display: block;')
      this.servicioCursoEstudiante.listarTodos().subscribe(resCursoEstudiante=>{
        var existeCursoEstudiante = resCursoEstudiante.filter(cursoEstudiante => cursoEstudiante.idUsuario.id == this.formCursoEstudiante.value.usuario.id && cursoEstudiante.idCurso.id == Number(this.curso))
        if(existeCursoEstudiante.length > 0){
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
            this.servicioEstado.listarPorId(14).subscribe(resEstado=>{
              this.servicioCurso.listarPorId(Number(this.curso)).subscribe(resCurso=>{
                this.servicioUsuario.listarPorId(this.formCursoEstudiante.value.usuario.id).subscribe(resUsuario=>{
                  let cursoEstudiante : CursoEstudiante = new CursoEstudiante();
                  cursoEstudiante.fecha = moment().format('YYYY-MM-DD HH:mm:ss A')
                  cursoEstudiante.idUsuario = resUsuario
                  cursoEstudiante.idCurso = resCurso;
                  cursoEstudiante.idEstado = resEstado;
                  this.registrarCursoEstudiante(cursoEstudiante);
                })
              })
            })
          }
        }else{
          this.servicioEstado.listarPorId(14).subscribe(resEstado=>{
            this.servicioCurso.listarPorId(Number(this.curso)).subscribe(resCurso=>{
              this.servicioUsuario.listarPorId(this.formCursoEstudiante.value.usuario.id).subscribe(resUsuario=>{
                let cursoEstudiante : CursoEstudiante = new CursoEstudiante();
                cursoEstudiante.fecha = moment().format('YYYY-MM-DD HH:mm:ss A')
                cursoEstudiante.idUsuario = resUsuario
                cursoEstudiante.idCurso = resCurso;
                cursoEstudiante.idEstado = resEstado;
                this.registrarCursoEstudiante(cursoEstudiante);
              })
            })
          })
        }
      })
    }else{
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'El campo esta vacio!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  public registrarCursoEstudiante(cursoEstudiante: CursoEstudiante) {
    this.servicioCursoEstudiante.registrar(cursoEstudiante).subscribe(res=>{
      document.getElementById('snipper')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Curso Estudiante Registrado!',
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
