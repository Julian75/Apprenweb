import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AgregarModuloComponent } from './agregar-modulo/agregar-modulo.component';
import { ModificarModuloComponent } from './modificar-modulo/modificar-modulo.component';
import { ModuloService } from 'src/app/services/modulo.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.css']
})
export class ModuloComponent {
  public listarModulos: any = [];

  displayedColumns = ['id', 'descripcion', 'opciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private servicioModulo: ModuloService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  public listarTodos () {
    this.servicioModulo.listarTodos().subscribe( res =>{
      this.listarModulos = res;
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  abrirModal(): void {
    const dialogRef = this.dialog.open(AgregarModuloComponent, {
      width: '500px',
      height: '350px',
      data: this.listarModulos
    });
  }

  modificarModulo(modulo: number): void {
    const dialogRef = this.dialog.open(ModificarModuloComponent, {
      width: '500px',
      height: '350px',
      data: [modulo, this.listarModulos]
    });
  }

  eliminarModulo(id:number){
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
        document.getElementById('snipperListaModulo')?.setAttribute('style', 'display: block;')
        this.servicioModulo.eliminar(id).subscribe(res=>{
          document.getElementById('snipperListaModulo')?.setAttribute('style', 'display: none;')
          this.listarTodos();
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            'Se elimino el modulo.',
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
