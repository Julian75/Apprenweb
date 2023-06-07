import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AgregarEstadoComponent } from './agregar-estado/agregar-estado.component';
import { ModificarEstadoComponent } from './modificar-estado/modificar-estado.component';
import { MatPaginator } from '@angular/material/paginator';
import { EstadoService } from 'src/app/services/estado.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.css']
})
export class EstadoComponent {
  public listarEstados: any = [];
  public modulo: any;

  displayedColumns = ['id', 'descripcion', 'modulo', 'observacion', 'opciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private servicioEstado: EstadoService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  public listarTodos () {
    this.servicioEstado.listarTodos().subscribe( res =>{
      this.listarEstados = res;
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  abrirModal(): void {
    const dialogRef = this.dialog.open(AgregarEstadoComponent, {
      width: '50%',
      height: '440px'
    });
  }

  modificarEstado(estado: any): void {
    const dialogRef = this.dialog.open(ModificarEstadoComponent, {
      width: '60%',
      height: '440px',
      data: estado
    });
  }

  eliminarEstado(id:number){
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
        document.getElementById('snipperListaEstado')?.setAttribute('style', 'display: block;')
        this.servicioEstado.eliminar(id).subscribe(res=>{
          document.getElementById('snipperListaEstado')?.setAttribute('style', 'display: none;')
          this.listarTodos();
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            'Se elimino el estado.',
            'success'
          )
        })
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
