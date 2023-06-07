import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-descargar-archivos',
  templateUrl: './descargar-archivos.component.html',
  styleUrls: ['./descargar-archivos.component.css']
})
export class DescargarArchivosComponent {

  public archivos: any = [];
  dtOptions: any = {};
  displayedColumns = ['nombreArchivo', 'opciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MatDialog,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public listarTodos(){
    this.archivos = this.data
    this.dataSource = new MatTableDataSource(this.archivos);

  }

  public descargarPdf(url: any){
    window.location.href = url;
  }
}
