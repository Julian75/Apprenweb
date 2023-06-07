import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { RolService } from 'src/app/services/rol.service';
import { MatSort } from '@angular/material/sort';
import { RolModificar } from 'src/app/models-actualizar/rolModificar';
import { CursoService } from 'src/app/services/curso.service';
import { AgregarCursoComponent } from '../curso/agregar-curso/agregar-curso.component';
import { ModificarCursoComponent } from '../curso/modificar-curso/modificar-curso.component';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CursoEstudianteService } from 'src/app/services/cursoEstudiante.service';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { CursoModificar } from 'src/app/models-actualizar/cursoModificar';
import { ModificarService } from 'src/app/services/modificar.service';

@Component({
  selector: 'app-mis-cursos',
  templateUrl: './mis-cursos.component.html',
  styleUrls: ['./mis-cursos.component.css']
})
export class MisCursosComponent {

  public listaCursos: any = [];
  public accesoRegistro: boolean = false;

  displayedColumns = ['id', 'categoria', 'titulo', 'descripcion', 'usuario', 'estado', 'opciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private servicioCurso: CursoService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioUsuario: UsuarioService,
    private serviciModificar: ModificarService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  public listarTodos () {
    this.servicioUsuario.listarPorId(Number(sessionStorage.getItem('id'))).subscribe(resUsuarioIde=>{
      this.servicioConsultasGenerales.listarMisCursos(resUsuarioIde.idRol.id, resUsuarioIde.id).subscribe(res =>{
        if(resUsuarioIde.idRol.id == 1 || resUsuarioIde.idRol.id == 3){
          this.accesoRegistro = true
        }
        this.listaCursos = res;
        this.dataSource = new MatTableDataSource(this.listaCursos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    })
  }

  registrarCurso(): void {
    const dialogRef = this.dialog.open(AgregarCursoComponent, {
      width: '50%',
      height: '440px',
      data: [this.listaCursos, 'mis cursos']
    });
  }

  modificarCurso(rol: number): void {
    const dialogRef = this.dialog.open(ModificarCursoComponent, {
      width: '50%',
      height: '440px',
      data: [rol, this.listaCursos]
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
        this.serviciModificar.actualizarCurso(cursoModificar).subscribe(resModificar=>{
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
