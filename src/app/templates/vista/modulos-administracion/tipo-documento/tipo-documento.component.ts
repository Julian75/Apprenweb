import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { RolService } from 'src/app/services/rol.service';
import { MatSort } from '@angular/material/sort';
import { TipoDocumentoService } from 'src/app/services/tipoDocumento.service';
import { AgregarTipoDocumentoComponent } from './agregar-tipo-documento/agregar-tipo-documento.component';
import { ModificarTipoDocumentoComponent } from './modificar-tipo-documento/modificar-tipo-documento.component';
import { TipoDocumentoModificar } from 'src/app/models-actualizar/tipoDocumentoModificar';

@Component({
  selector: 'app-tipo-documento',
  templateUrl: './tipo-documento.component.html',
  styleUrls: ['./tipo-documento.component.css']
})
export class TipoDocumentoComponent {
  public listaTiposDocumentos: any = [];

  displayedColumns = ['id', 'descripcion', 'estado', 'opciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private servicioTipoDocumento: TipoDocumentoService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  public listarTodos () {
    this.servicioTipoDocumento.listarTodos().subscribe(res =>{
      this.listaTiposDocumentos = res;
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  abrirModal(): void {
    const dialogRef = this.dialog.open(AgregarTipoDocumentoComponent, {
      width: '450px',
      height: '250px',
      data: this.listaTiposDocumentos
    });
  }


  modificarTipoDocumento(tipoDocumento: any): void {
    const dialogRef = this.dialog.open(ModificarTipoDocumentoComponent, {
      width: '450px',
      height: '250px',
      data: [tipoDocumento, this.listaTiposDocumentos]
    });
  }

  eliminarTipoDocumento(tipoDocumento: any){
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
        document.getElementById('snipperListaTipoDocumento')?.setAttribute('style', 'display: block;')
        let tipoDocumentoModificar : TipoDocumentoModificar = new TipoDocumentoModificar();
        tipoDocumentoModificar.id = tipoDocumento.id
        tipoDocumentoModificar.descripcion = tipoDocumento.descripcion
        tipoDocumentoModificar.idEstado = 3
        this.servicioTipoDocumento.actualizar(tipoDocumentoModificar).subscribe(resModificar=>{
          document.getElementById('snipperListaTipoDocumento')?.setAttribute('style', 'display: none;')
          this.listarTodos();
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            'Se inactivo el tipo de documento.',
            'success'
          )
        }, error => {
          document.getElementById('snipperListaTipoDocumento')?.setAttribute('style', 'display: none;')
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
