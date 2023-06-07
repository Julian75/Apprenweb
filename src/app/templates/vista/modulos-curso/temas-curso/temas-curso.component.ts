import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModificarService } from 'src/app/services/modificar.service';
import { CursoService } from 'src/app/services/curso.service';
import { CursoModificar } from 'src/app/models-actualizar/cursoModificar';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TemaCursoService } from 'src/app/services/temaCurso.service';
import { ModificarTemaCursoComponent } from './modificar-tema-curso/modificar-tema-curso.component';
import { AgregarTemaCursoComponent } from './agregar-tema-curso/agregar-tema-curso.component';
import { TemaCursoModificar } from 'src/app/models-actualizar/temaCursoModificar';

@Component({
  selector: 'app-temas-curso',
  templateUrl: './temas-curso.component.html',
  styleUrls: ['./temas-curso.component.css']
})
export class TemasCursoComponent {

  public listaTemasCurso: any = [];

  displayedColumns = ['id', 'tipoCurso', 'titulo', 'descripcion', 'seccionCurso', 'temaCurso', 'usuario', 'estado', 'opciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private servicioTemasCurso: TemaCursoService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioModificar: ModificarService,
    private servicioUsuario: UsuarioService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  public listarTodos () {
    this.servicioTemasCurso.listarTodos().subscribe(resTemasCursoTodos=> {
      this.servicioUsuario.listarPorId(Number(sessionStorage.getItem('id'))).subscribe(resUsuarioIde=> {
        if(resUsuarioIde.idRol.id == 1){
          this.listaTemasCurso = resTemasCursoTodos;
        }else{
          this.listaTemasCurso = resTemasCursoTodos.filter(temCur=> temCur.idSeccionCurso.idCurso.idUsuario.id == Number(sessionStorage.getItem('id')));
        }
        this.dataSource = new MatTableDataSource(this.listaTemasCurso);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    })
  }

  abrirModal(): void {
    const dialogRef = this.dialog.open(AgregarTemaCursoComponent, {
      width: '50%',
      height: '440px',
      data: this.listaTemasCurso
    });
  }

  modificarTemaCurso(temaCurso: number): void {
    const dialogRef = this.dialog.open(ModificarTemaCursoComponent, {
      width: '50%',
      height: '440px',
      data: [temaCurso, this.listaTemasCurso]
    });
  }

  eliminarTemaCurso(temaCurso: any){
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
        document.getElementById('snipperListaTemaCurso')?.setAttribute('style', 'display: block;')
        let temaCursoModificar : TemaCursoModificar = new TemaCursoModificar();
        temaCursoModificar.id = temaCurso.id
        temaCursoModificar.descripcion = temaCurso.descripcion
        temaCursoModificar.idSeccionCurso = temaCurso.idSeccionCurso.id
        temaCursoModificar.idEstado = 25
        this.servicioModificar.actualizarTemaCurso(temaCursoModificar).subscribe(resModificar=>{
          this.listarTodos();
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            'Se elimino el tema del curso.',
            'success'
          )
          document.getElementById('snipperListaTemaCurso')?.setAttribute('style', 'display: none;')
        }, error => {
          document.getElementById('snipperListaTemaCurso')?.setAttribute('style', 'display: none;')
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
