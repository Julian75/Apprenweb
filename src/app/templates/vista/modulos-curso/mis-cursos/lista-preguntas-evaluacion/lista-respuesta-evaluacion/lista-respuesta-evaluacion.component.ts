import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModificarService } from 'src/app/services/modificar.service';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { RespuestaEvaluacionService } from 'src/app/services/respuestaEvaluacion.service';
import { AgregarRespuestaEvaluacionComponent } from './agregar-respuesta-evaluacion/agregar-respuesta-evaluacion.component';
import { ModificarRespuestaEvaluacionComponent } from './modificar-respuesta-evaluacion/modificar-respuesta-evaluacion.component';
import { RespuestaEvaluacionModificar } from 'src/app/models-actualizar/respuestaEvaluacionModificar';
import { PreguntaEvaluacionService } from 'src/app/services/preguntaEvaluacion.service';

@Component({
  selector: 'app-lista-respuesta-evaluacion',
  templateUrl: './lista-respuesta-evaluacion.component.html',
  styleUrls: ['./lista-respuesta-evaluacion.component.css']
})
export class ListaRespuestaEvaluacionComponent {

  public listaRespuestasEvaluacion: any = [];

  displayedColumns = ['id', 'respuesta', 'correcta', 'estado', 'opciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private servicioRespuestasEvaluacion: RespuestaEvaluacionService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioModificar: ModificarService,
    private servicioPregunta: PreguntaEvaluacionService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  idPreguntaEvaluacion: any;
  idCurso: any;
  public listarTodos () {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.idPreguntaEvaluacion = params.get('id')
      this.servicioPregunta.listarPorId(this.idPreguntaEvaluacion).subscribe(resPregunta=>{
        this.idCurso = resPregunta.idTemaCurso.idSeccionCurso.idCurso.id
        this.servicioConsultasGenerales.listarRespuestaIdPregunta(this.idPreguntaEvaluacion).subscribe(res =>{
          this.listaRespuestasEvaluacion = res;
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })
      })
    })
  }

  abrirModal(): void {
    const dialogRef = this.dialog.open(AgregarRespuestaEvaluacionComponent, {
      width: '40%',
      height: '360px',
      data: this.idPreguntaEvaluacion
    });
  }

  modificarRespuestaEvaluacion(respuestaEvaluacion: number): void {
    this.servicioRespuestasEvaluacion.listarPorId(respuestaEvaluacion).subscribe(resRespuesta=>{
      const dialogRef = this.dialog.open(ModificarRespuestaEvaluacionComponent, {
        width: '40%',
        height: '350px',
        data: [resRespuesta, this.listaRespuestasEvaluacion]
      });
    })
  }

  eliminarRespuestaEvaluacion(respuestaEvaluacion: any){
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
        document.getElementById('snipperlistaRespuestasEvaluacion')?.setAttribute('style', 'display: block;')
        let respuestaModificar : RespuestaEvaluacionModificar = new RespuestaEvaluacionModificar();
        respuestaModificar.id = respuestaEvaluacion.id
        respuestaModificar.descripcion = respuestaEvaluacion.descripcion.toUpperCase()
        respuestaModificar.correcta = respuestaEvaluacion.correcta
        respuestaModificar.idPreguntaEvaluacion = respuestaEvaluacion.idPreguntaEvaluacion
        respuestaModificar.idEstado = 20
        this.servicioModificar.actualizarRespuestaEvaluacion(respuestaModificar).subscribe(resModificar=>{
          this.listarTodos();
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            'Se elimino la respuesta.',
            'success'
          )
          document.getElementById('snipperlistaRespuestasEvaluacion')?.setAttribute('style', 'display: none;')
        }, error => {
          document.getElementById('snipperlistaRespuestasEvaluacion')?.setAttribute('style', 'display: none;')
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

  public devolverPregunta(){
    this.router.navigate(['/vista/preguntasEvaluacion/'+this.idCurso]);
  }
}
