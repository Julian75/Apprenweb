import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioModificar } from 'src/app/models-actualizar/usuarioModificar';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {
  public listaUsuarios: any = [];

  displayedColumns = ['id', 'usuario', 'correo', 'tipoDocumento', 'rol', 'estado', 'opciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private servicioUsuario: UsuarioService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  public listarTodos () {
    this.servicioUsuario.listarTodos().subscribe(res =>{
      this.listaUsuarios = res;
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  eliminarUsuario(usuario: any){
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
        document.getElementById('snipperListaUsuario')?.setAttribute('style', 'display: block;')
        let usuarioModificar : UsuarioModificar = new UsuarioModificar();
        usuarioModificar.id = usuario.id
        usuarioModificar.nombre = usuario.nombre
        usuarioModificar.apellido = usuario.apellido
        usuarioModificar.correo = usuario.correo
        usuarioModificar.idTipoDocumento = usuario.idTipoDocumento.id
        usuarioModificar.documento = usuario.documento
        usuarioModificar.idRol = usuario.idRol.id
        usuarioModificar.password = usuario.password
        usuarioModificar.idEstado = 7
        this.servicioUsuario.actualizar(usuarioModificar).subscribe(resModificar=>{
          document.getElementById('snipperListaUsuario')?.setAttribute('style', 'display: none;')
          this.listarTodos();
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            'Se inactivo el usuario.',
            'success'
          )
        }, error => {
          document.getElementById('snipperListaUsuario')?.setAttribute('style', 'display: none;')
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
