import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModificarService } from 'src/app/services/modificar.service';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PreguntaEvaluacionService } from 'src/app/services/preguntaEvaluacion.service';
import { AgregarPreguntaEvaluacionComponent } from './agregar-pregunta-evaluacion/agregar-pregunta-evaluacion.component';
import { ModificarPreguntaEvaluacionComponent } from './modificar-pregunta-evaluacion/modificar-pregunta-evaluacion.component';
import { PreguntaEvaluacionModificar } from 'src/app/models-actualizar/preguntaEvaluacionModificar';

@Component({
  selector: 'app-lista-preguntas-evaluacion',
  templateUrl: './lista-preguntas-evaluacion.component.html',
  styleUrls: ['./lista-preguntas-evaluacion.component.css']
})
export class ListaPreguntasEvaluacionComponent {

  public listaPreguntasEvaluacion: any = [];

  displayedColumns = ['id', 'seccionCurso', 'temaCurso', 'pregunta', 'estado', 'opciones'];
  dataSource!:MatTableDataSource<any>;

  displayedColumns2 = ['id', 'categoria', 'titulo', 'descripcion', 'seccionCurso', 'temaCurso', 'pregunta', 'usuario', 'estado', 'opciones'];
  dataSource2!:MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ServicioPreguntasEvaluacion: PreguntaEvaluacionService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioModificar: ModificarService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  idPreguntaEvaluacion: any;
  public listarTodos () {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.idPreguntaEvaluacion = params.get('id')
      if(this.idPreguntaEvaluacion != null){
        document.getElementById('misCursos')?.setAttribute('style', 'display: block;')
        this.servicioConsultasGenerales.listarPreguntaIdCurso(this.idPreguntaEvaluacion).subscribe(res =>{
          this.listaPreguntasEvaluacion = res;
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })
      }else{
        document.getElementById('evaluaciones')?.setAttribute('style', 'display: block;')
        document.getElementById('devolver')?.setAttribute('style', 'display: none;')
        this.ServicioPreguntasEvaluacion.listarTodos().subscribe(res=>{
          this.listaPreguntasEvaluacion = res;
          this.dataSource2 = new MatTableDataSource(res);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        })
      }
    })
  }

  abrirModal(): void {
    if(this.idPreguntaEvaluacion != null){
      const dialogRef = this.dialog.open(AgregarPreguntaEvaluacionComponent, {
        width: '40%',
        height: '360px',
        data: this.idPreguntaEvaluacion
      });
    }else{
      const dialogRef = this.dialog.open(AgregarPreguntaEvaluacionComponent, {
        width: '40%',
        height: '440px',
        data: this.idPreguntaEvaluacion
      });
    }
  }

  modificarPreguntaEvaluacion(preguntaEvaluacion: number): void {
    this.ServicioPreguntasEvaluacion.listarPorId(preguntaEvaluacion).subscribe(resPregunta=>{
      if(this.idPreguntaEvaluacion != null){
        const dialogRef = this.dialog.open(ModificarPreguntaEvaluacionComponent, {
          width: '40%',
          height: '350px',
          data: [resPregunta, this.listaPreguntasEvaluacion, this.idPreguntaEvaluacion]
        });
      }else{
        const dialogRef = this.dialog.open(ModificarPreguntaEvaluacionComponent, {
          width: '40%',
          height: '440px',
          data: [resPregunta, this.listaPreguntasEvaluacion, this.idPreguntaEvaluacion]
        });
      }
    })
  }

  eliminarPreguntaEvaluacion(preguntaEvaluacion: any){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger mx-5'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estas seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        document.getElementById('snipperlistaPreguntasEvaluacion')?.setAttribute('style', 'display: block;')
        let preguntaModificar : PreguntaEvaluacionModificar = new PreguntaEvaluacionModificar();
        if(this.idPreguntaEvaluacion != null){
          preguntaModificar.id = preguntaEvaluacion.id
          preguntaModificar.descripcion = preguntaEvaluacion.descripcion.toUpperCase()
          preguntaModificar.idTemaCurso = preguntaEvaluacion.idTemaCurso
          preguntaModificar.idEstado = 18
        }else{
          preguntaModificar.id = preguntaEvaluacion.id
          preguntaModificar.descripcion = preguntaEvaluacion.descripcion.toUpperCase()
          preguntaModificar.idTemaCurso = preguntaEvaluacion.idTemaCurso.id
          preguntaModificar.idEstado = 18
        }
        this.servicioModificar.actualizarPreguntaEvaluacion(preguntaModificar).subscribe(resModificar=>{
          this.listarTodos();
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            'Se elimino la pregunta.',
            'success'
          )
          document.getElementById('snipperlistaPreguntasEvaluacion')?.setAttribute('style', 'display: none;')
        }, error => {
          document.getElementById('snipperlistaPreguntasEvaluacion')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Hubo un error al eliminar!',
            showConfirmButton: false,
            timer: 1500
          })
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado!',
          '',
          'error'
        )
      }
    })
  }

  public devolver(){
    this.router.navigate(['/vista/misCursos']);
  }
}
