import { Component, ViewChild } from '@angular/core';
import { AgregarCursoComponent } from '../../curso/agregar-curso/agregar-curso.component';
import { CursoService } from 'src/app/services/curso.service';
import { MatDialog } from '@angular/material/dialog';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AgregarSeccionCursoComponent } from './agregar-seccion-curso/agregar-seccion-curso.component';
import Swal from 'sweetalert2';
import { SeccionCursoModificar } from 'src/app/models-actualizar/seccionCursoModificar';
import { ModificarService } from 'src/app/services/modificar.service';
import { ModificarSeccionCursoComponent } from './modificar-seccion-curso/modificar-seccion-curso.component';

@Component({
  selector: 'app-lista-secciones-curso',
  templateUrl: './lista-secciones-curso.component.html',
  styleUrls: ['./lista-secciones-curso.component.css']
})
export class ListaSeccionesCursoComponent {

  public listaSeccionesCurso: any = [];

  displayedColumns = ['id', 'curso', 'descripcion', 'fase', 'estado', 'opciones'];
  dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private servicioModificar: ModificarService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  private listarTodos(){
    this.route.paramMap.subscribe((params: ParamMap) => {
      var idCapturadoUrl = params.get('id')
      this.servicioConsultasGenerales.listarSeccionesCurso(Number(idCapturadoUrl)).subscribe(resSeccionesCurso=>{
        this.listaSeccionesCurso = resSeccionesCurso
        this.dataSource = new MatTableDataSource(resSeccionesCurso);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    })
  }

  registrarSeccionCurso(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      var idCapturadoUrl = params.get('id')
      const dialogRef = this.dialog.open(AgregarSeccionCursoComponent, {
        width: '60%',
        height: '440px',
        data: idCapturadoUrl
      });
    })
  }

  modificarSeccion(seccion: any){
    const dialogRef = this.dialog.open(ModificarSeccionCursoComponent, {
      width: '60%',
      height: '440px',
      data: seccion
    });
  }

  inactivarSeccion(seccion: any){
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
        document.getElementById('snipperListaSeccionCurso')?.setAttribute('style', 'display: block;')
        let seccionModificar : SeccionCursoModificar = new SeccionCursoModificar();
        seccionModificar.id = seccion.idSeccionCurso
        seccionModificar.descripcion = seccion.descripcion
        seccionModificar.fase = seccion.fase
        seccionModificar.idCurso = seccion.idCurso
        seccionModificar.idEstado = 13
        console.log(seccion, seccionModificar)
        this.servicioModificar.actualizarSeccionCurso(seccionModificar).subscribe(resSeccionCursoModificado=>{
          this.servicioConsultasGenerales.listarSeccionesCurso(seccion.idCurso).subscribe(resSeccionesIdCurso=>{
            console.log(resSeccionCursoModificado, seccion.idCurso)
            if(resSeccionesIdCurso.length > 0){
              var seccionesFase = resSeccionesIdCurso.filter(sec=> sec.fase > seccion.fase && seccion.idEstado == 12)
              console.log(seccionesFase)
              for (let indexSeccion = 0; indexSeccion < seccionesFase.length; indexSeccion++) {
                const elementSeccion = seccionesFase[indexSeccion];
                let seccionModificar : SeccionCursoModificar = new SeccionCursoModificar();
                seccionModificar.id = elementSeccion.idSeccionCurso
                seccionModificar.descripcion = elementSeccion.descripcion
                seccionModificar.fase = Number(elementSeccion.fase)-1
                seccionModificar.idCurso = elementSeccion.idCurso
                seccionModificar.idEstado = 12
                this.servicioModificar.actualizarSeccionCurso(seccionModificar).subscribe(resSeccionCursoModificado=>{
                  if((indexSeccion+1) == seccionesFase.length){
                    document.getElementById('snipperListaSeccionCurso')?.setAttribute('style', 'display: none;')
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: 'Seccion Eliminada!',
                      showConfirmButton: false,
                      timer: 1500
                    })
                    location.reload()
                  }
                }, error => {
                  document.getElementById('snipperListaSeccionCurso')?.setAttribute('style', 'display: none;')
                  Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Hubo un error al modificar las demas secciones!',
                    showConfirmButton: false,
                    timer: 1500
                  })
                });
              }
            }else{
              document.getElementById('snipperListaSeccionCurso')?.setAttribute('style', 'display: none;')
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Seccion Eliminada!',
                showConfirmButton: false,
                timer: 1500
              })
            }
          })
        }, error => {
          document.getElementById('snipperListaSeccionCurso')?.setAttribute('style', 'display: none;')
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
