import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AccesoService } from 'src/app/services/acceso.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AgregarAccesoComponent } from './agregar-acceso/agregar-acceso.component';
import { ModificarAccesoComponent } from './modificar-acceso/modificar-acceso.component';

@Component({
  selector: 'app-acceso',
  templateUrl: './acceso.component.html',
  styleUrls: ['./acceso.component.css']
})
export class AccesoComponent {
  public listaAccesos: any = [];

  displayedColumns = ['id', 'rol', 'modulo', 'opciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private servicioAcceso: AccesoService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  public listarTodos () {
    this.servicioAcceso.listarTodos().subscribe( res =>{
      this.listaAccesos = res;
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  abrirModal(): void {
    const dialogRef = this.dialog.open(AgregarAccesoComponent, {
      width: '50%',
      height: '60%'
    });
  }

  modificarAcceso(acceso: any): void {
    const dialogRef = this.dialog.open(ModificarAccesoComponent, {
      width: '50%',
      height: '60%',
      data: acceso
    });
  }

  eliminarAcceso(id:number){
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
        document.getElementById('snipperListaAcceso')?.setAttribute('style', 'display: block;')
        this.servicioAcceso.eliminar(id).subscribe(res=>{
          document.getElementById('snipperListaAcceso')?.setAttribute('style', 'display: none;')
          this.listarTodos();
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            'Se elimino el acceso.',
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
