import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AgregarContenidoCursoComponent } from './agregar-contenido-curso/agregar-contenido-curso.component';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { DescargarArchivosComponent } from './descargar-archivos/descargar-archivos.component';
import { SubirPdfService } from 'src/app/services/subirPdf.service';

@Component({
  selector: 'app-contenido-curso',
  templateUrl: './contenido-curso.component.html',
  styleUrls: ['./contenido-curso.component.css']
})
export class ContenidoCursoComponent {

  public listaTemasCurso: any = [];

  displayedColumns = ['id', 'categoria', 'titulo', 'descripcion', 'seccionCurso', 'temaCurso', 'usuario', 'estado', 'opciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioPdf: SubirPdfService,
    private servicioUsuario: UsuarioService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }


  public listarTodos () {
    this.servicioUsuario.listarPorId(Number(sessionStorage.getItem('id'))).subscribe(resUsuarioIde=> {
      this.servicioConsultasGenerales.listarTemasCursoContenido().subscribe(resTemasCursoContenido=>{
        if(resUsuarioIde.idRol.id == 1){
          this.listaTemasCurso = resTemasCursoContenido;
        }else{
          this.listaTemasCurso = resTemasCursoContenido.filter(temCur=> temCur.idUsuario == Number(sessionStorage.getItem('id')));
        }
        this.dataSource = new MatTableDataSource(this.listaTemasCurso);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    })
  }

  abrirModal(): void {
    const dialogRef = this.dialog.open(AgregarContenidoCursoComponent, {
      width: '50%',
      height: '440px',
      data: this.listaTemasCurso
    });
  }

  visualizarContenidosCurso(temaCurso: any){
    console.log(temaCurso)
    this.servicioConsultasGenerales.listarContenidoCursoidTema(temaCurso.idTemaCurso).subscribe(resContenidosCurso=>{
      console.log(resContenidosCurso)
      this.servicioPdf.listarTodoContenidoCurso().subscribe((resContenido: any)=>{
        console.log(resContenido)
      //   resContenidosCurso.filter((elementContenidoCurso: any)=>{
      //     (resContenido.filter((contenidoSubido: any)=> elementContenidoCurso.descripcionArchivo == contenidoSubido.name)).filter((contenidoUrl: any)=> listaPdf.push(contenidoUrl))
      //   })
      //   if(resContenidosCurso.length > 1){
      //     var listaPdf: any = []
      //       console.log(listaPdf)
      //       const dialogRef = this.dialog.open(DescargarArchivosComponent, {
      //         width: '50%',
      //         height: '440px',
      //         data: listaPdf
      //       });
      // // this.servicioPdf.listarTodosSegunda().subscribe(resPdf => {
      // //     resArchivos.forEach(elementArchivos => {
      // //       for(const i in resPdf){
      // //         if (elementArchivos.nombreArchivo == resPdf[i].name) {
      // //           listaPdf.push(resPdf[i])
      // //         }
      // //       }
      // //     })
      // //     if(listaPdf.length > 1){
      // //       const dialogRef = this.dialog.open(DescargasMultiplesComponent, {
      // //         width: '500px',
      // //         data: listaPdf
      // //       });
      // //     }else if(listaPdf.length == 1){
      // //       window.location.href = listaPdf[0].url;
      // //     }
      // // })

      //   }else{
      //     window.location.href = listaPdf[0].url;
      //   }
      })
    })
  }
}
