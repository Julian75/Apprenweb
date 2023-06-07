import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModificarService } from 'src/app/services/modificar.service';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { AgregarCursoEstudianteComponent } from './agregar-curso-estudiante/agregar-curso-estudiante.component';
import { ModificarCursoEstudianteComponent } from './modificar-curso-estudiante/modificar-curso-estudiante.component';
import { CursoEstudianteService } from 'src/app/services/cursoEstudiante.service';
import { CursoEstudianteModificar } from 'src/app/models-actualizar/cursoEstudianteModificar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-lista-curso-estudiantes',
  templateUrl: './lista-curso-estudiantes.component.html',
  styleUrls: ['./lista-curso-estudiantes.component.css']
})
export class ListaCursoEstudiantesComponent {

  public listaCursosEstudiante: any = [];

  displayedColumns = ['id', 'estudiante', 'fecha', 'estado', 'opciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ServicioCurso: CursoEstudianteService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioModificar: ModificarService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  idCurso: any;
  public listarTodos () {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.idCurso = params.get('id')
      this.servicioConsultasGenerales.listarCursoEstudianteIdCurso(this.idCurso).subscribe(res =>{
        console.log(res)
        this.listaCursosEstudiante = res;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    })
  }

  abrirModal(): void {
    const dialogRef = this.dialog.open(AgregarCursoEstudianteComponent, {
      width: '30%',
      height: '300px',
      data: this.idCurso
    });
  }


  modificarCursoEstudiante(curso: number): void {
    this.ServicioCurso.listarPorId(curso).subscribe(resCursoEstudiante=>{
      const dialogRef = this.dialog.open(ModificarCursoEstudianteComponent, {
        width: '40%',
        height: '350px',
        data: [resCursoEstudiante, this.listaCursosEstudiante]
      });
    })
  }

  eliminarCursoEstudiante(curso: any){
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
        document.getElementById('snipperlistaCursosEstudiante')?.setAttribute('style', 'display: block;')
        let cursoModificar : CursoEstudianteModificar = new CursoEstudianteModificar();
        cursoModificar.id = curso.id
        cursoModificar.fecha = curso.fecha
        cursoModificar.idCurso = curso.idCurso
        cursoModificar.idUsuario = curso.idUsuario
        cursoModificar.idEstado = 21
        this.servicioModificar.actualizarCursoEstudiante(cursoModificar).subscribe(resModificar=>{
          this.listarTodos();
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            'Se elimino el curso estudiante.',
            'success'
          )
          document.getElementById('snipperlistaCursosEstudiante')?.setAttribute('style', 'display: none;')
        }, error => {
          document.getElementById('snipperlistaCursosEstudiante')?.setAttribute('style', 'display: none;')
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
