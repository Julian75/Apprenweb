import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModificarService } from 'src/app/services/modificar.service';
import { CursoService } from 'src/app/services/curso.service';
import { AgregarCursoComponent } from './agregar-curso/agregar-curso.component';
import { ModificarCursoComponent } from './modificar-curso/modificar-curso.component';
import { CursoModificar } from 'src/app/models-actualizar/cursoModificar';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})
export class CursoComponent {

  public listaCursos: any = [];

  displayedColumns = ['id', 'tipoCurso', 'titulo', 'descripcion', 'usuario', 'estado', 'opciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ServicioCurso: CursoService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioModificar: ModificarService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  public listarTodos () {
    this.servicioConsultasGenerales.listarMisCursos(1, 0).subscribe(res =>{
      this.listaCursos = res;
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  abrirModal(): void {
    const dialogRef = this.dialog.open(AgregarCursoComponent, {
      width: '50%',
      height: '440px',
      data: [this.listaCursos, 'curso']
    });
  }


  modificarCurso(curso: number): void {
    const dialogRef = this.dialog.open(ModificarCursoComponent, {
      width: '50%',
      height: '440px',
      data: [curso, this.listaCursos, 'curso']
    });
  }

  eliminarCurso(curso: any){
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
        document.getElementById('snipperlistaCursos')?.setAttribute('style', 'display: block;')
        let cursoModificar : CursoModificar = new CursoModificar();
        cursoModificar.id = curso.idCurso
        cursoModificar.titulo = curso.titulo
        cursoModificar.descripcion = curso.descripcion
        cursoModificar.idCategoria = curso.idCategoria
        cursoModificar.idUsuario = curso.idUsuario
        cursoModificar.idEstado = 11
        this.servicioModificar.actualizarCurso(cursoModificar).subscribe(resModificar=>{
          this.listarTodos();
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            'Se elimino el curso.',
            'success'
          )
          document.getElementById('snipperlistaCursos')?.setAttribute('style', 'display: none;')
        }, error => {
          document.getElementById('snipperlistaCursos')?.setAttribute('style', 'display: none;')
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
}
