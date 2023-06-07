import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';

@Component({
  selector: 'app-visualizar-evaluaciones',
  templateUrl: './visualizar-evaluaciones.component.html',
  styleUrls: ['./visualizar-evaluaciones.component.css']
})
export class VisualizarEvaluacionesComponent {

  displayedColumns = ['categoria', 'titulo', 'descripcion', 'seccionCurso', 'temaCurso', 'opciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private servicioConsultasGenerales: ConsultasGeneralesService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  public listarTodos () {
    this.servicioConsultasGenerales.listarTrazabilidadEvaluacion(Number(sessionStorage.getItem('id'))).subscribe(res=>{
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
}
