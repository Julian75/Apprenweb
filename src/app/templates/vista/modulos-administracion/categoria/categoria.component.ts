import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CategoriaService } from 'src/app/services/categoria.service';
import { AgregarCategoriaComponent } from './agregar-categoria/agregar-categoria.component';
import { ModificarCategoriaComponent } from './modificar-categoria/modificar-categoria.component';
import { CategoriaModificar } from 'src/app/models-actualizar/categoriaModificar';
import { ModificarService } from 'src/app/services/modificar.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent {

  public listaCategoria: any = [];

  displayedColumns = ['id', 'descripcion', 'estado', 'opciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private servicioCategoria: CategoriaService,
    private servicioModificar: ModificarService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  public listarTodos () {
    this.servicioCategoria.listarTodos().subscribe(res =>{
      this.listaCategoria = res;
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  abrirModal(): void {
    const dialogRef = this.dialog.open(AgregarCategoriaComponent, {
      width: '450px',
      height: '250px'
    });
  }


  modificarCategoria(categoria: number): void {
    const dialogRef = this.dialog.open(ModificarCategoriaComponent, {
      width: '450px',
      height: '350px',
      data: [categoria, this.listaCategoria]
    });
  }

  eliminarCategoria(categoria: any){
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
        document.getElementById('snipperListaCategoria')?.setAttribute('style', 'display: block;')
        let categoriaModificar : CategoriaModificar = new CategoriaModificar();
        categoriaModificar.id = categoria.id
        categoriaModificar.descripcion = categoria.descripcion
        categoriaModificar.idEstado = 9
        this.servicioModificar.actualizarCategoria(categoriaModificar).subscribe(resModificar=>{
          this.listarTodos();
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            'Se elimino la categoria.',
            'success'
          )
          document.getElementById('snipperListaCategoria')?.setAttribute('style', 'display: none;')
        }, error => {
          document.getElementById('snipperListaCategoria')?.setAttribute('style', 'display: none;')
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
