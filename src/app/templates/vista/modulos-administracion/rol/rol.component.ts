import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { RolService } from 'src/app/services/rol.service';
import { AgregarRolComponent } from './agregar-rol/agregar-rol.component';
import { ModificarRolComponent } from './modificar-rol/modificar-rol.component';
import { MatSort } from '@angular/material/sort';
import { RolModificar } from 'src/app/models-actualizar/rolModificar';
import { ModificarService } from 'src/app/services/modificar.service';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent {
  public listaRoles: any = [];

  displayedColumns = ['id', 'descripcion', 'estado', 'opciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private servicioRol: RolService,
    private servicioModificar: ModificarService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  public listarTodos () {
    this.servicioRol.listarTodos().subscribe(res =>{
      this.listaRoles = res;
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  abrirModal(): void {
    const dialogRef = this.dialog.open(AgregarRolComponent, {
      width: '450px',
      height: '250px',
      data: this.listaRoles
    });
  }


  modificarRol(rol: number): void {
    const dialogRef = this.dialog.open(ModificarRolComponent, {
      width: '450px',
      height: '250px',
      data: [rol, this.listaRoles]
    });
  }

  eliminarRol(rol: any){
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
        document.getElementById('snipperListaRol')?.setAttribute('style', 'display: block;')
        let rolModificar : RolModificar = new RolModificar();
        rolModificar.id = rol.id
        rolModificar.descripcion = rol.descripcion
        rolModificar.idEstado = 5
        this.servicioModificar.actualizarRol(rolModificar).subscribe(resModificar=>{
          this.listarTodos();
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            'Se elimino el rol.',
            'success'
          )
          document.getElementById('snipperListaRol')?.setAttribute('style', 'display: none;')
        }, error => {
          document.getElementById('snipperListaRol')?.setAttribute('style', 'display: none;')
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
