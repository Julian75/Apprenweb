import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SeccionCursoModificar } from 'src/app/models-actualizar/seccionCursoModificar';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { CursoService } from 'src/app/services/curso.service';
import { EstadoService } from 'src/app/services/estado.service';
import { ModificarService } from 'src/app/services/modificar.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-seccion-curso',
  templateUrl: './modificar-seccion-curso.component.html',
  styleUrls: ['./modificar-seccion-curso.component.css']
})
export class ModificarSeccionCursoComponent {

  public formSeccionCurso!: FormGroup;
  public listaFormularioFases: any = [];
  public listaEstados: any = [];
  public idFase: number = 0;
  public seccionCurso: any;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public idSeccion: MatDialog,
    public dialogRef: MatDialogRef<ModificarSeccionCursoComponent>,
    public servicioConsultasGenerales: ConsultasGeneralesService,
    public servicioCurso: CursoService,
    public servicioEstado: EstadoService,
    public servicioModificar: ModificarService
  ){}

  ngOnInit(): void {
    this.crearFormulario();
    this.listarEstados()
    this.listarTodos()
  }

  private crearFormulario(){
    this.formSeccionCurso = this.fb.group({
      id: 0,
      fase: [null,Validators.required],
      descripcion: [null,Validators.required],
      estado: [null,Validators.required]
    })
  }

  private listarEstados(){
    this.servicioConsultasGenerales.listarEstadosIdModulo(8).subscribe(resEstadosSeccion=>{
      this.listaEstados = resEstadosSeccion
    })
  }

  private listarTodos(){
    this.seccionCurso = this.idSeccion
    this.idFase = this.seccionCurso.fase
    this.formSeccionCurso.controls['id'].setValue(this.seccionCurso.idSeccion);
    this.formSeccionCurso.controls['fase'].setValue(this.seccionCurso.fase);
    this.formSeccionCurso.controls['descripcion'].setValue(this.seccionCurso.descripcion);
    this.formSeccionCurso.controls['estado'].setValue(this.seccionCurso.idEstado);
  }

  public modificar(){
    if(this.formSeccionCurso.valid){
      document.getElementById('snipperModificarSeccionCurso')?.setAttribute('style', 'display: block;')
      if(this.seccionCurso.fase == this.formSeccionCurso.value.fase && this.seccionCurso.descripcion.toUpperCase() == this.formSeccionCurso.value.descripcion.toUpperCase() && this.seccionCurso.idEstado == this.formSeccionCurso.value.estado){
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'No hubieron cambios!',
          showConfirmButton: false,
          timer: 1500
        })
        this.dialogRef.close()
        document.getElementById('snipperModificarSeccionCurso')?.setAttribute('style', 'display: none;')
      }else if(this.formSeccionCurso.value.fase > 0){
        this.servicioConsultasGenerales.listarSeccionesCurso(this.seccionCurso.idCurso).subscribe(resSeccionCur=>{
          var mayorSeccionCurso = Math.max(...resSeccionCur.map(seccion => seccion.fase))
          if(this.formSeccionCurso.value.fase > mayorSeccionCurso){
            document.getElementById('snipperModificarSeccionCurso')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'la fase no debe ser mayor a los ya registrados!',
              showConfirmButton: false,
              timer: 1500
            })
          }else{
            var restaNumero = this.seccionCurso.fase - this.formSeccionCurso.value.fase
            var existeSeccionDescripcion = resSeccionCur.filter(seccionC=>seccionC.idSeccionCurso != this.seccionCurso.idSeccionCurso && seccionC.descripcion == this.formSeccionCurso.value.descripcion)
            var existeSeccionEstado = resSeccionCur.filter(seccionC=> seccionC.idSeccionCurso == this.seccionCurso.idSeccionCurso && seccionC.idEstado == this.formSeccionCurso.value.estado)
            var existeSeccionFase = resSeccionCur
            if((this.formSeccionCurso.value.estado == 12 && ((this.seccionCurso.fase < restaNumero) || (this.seccionCurso.fase > restaNumero))) || (this.formSeccionCurso.value.estado == 13 && this.seccionCurso.fase == restaNumero)){
              existeSeccionFase = existeSeccionFase.filter(seccionC=> seccionC.idSeccionCurso != this.seccionCurso.idSeccionCurso && seccionC.fase <= this.formSeccionCurso.value.fase)
            }else{
              existeSeccionFase = existeSeccionFase.filter(seccionC=> seccionC.idSeccionCurso != this.seccionCurso.idSeccionCurso && seccionC.fase > this.formSeccionCurso.value.fase)
            }
            if(existeSeccionDescripcion.length > 0){
              document.getElementById('snipperModificarSeccionCurso')?.setAttribute('style', 'display: none;')
              Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Ya existe esa seccion!',
                showConfirmButton: false,
                timer: 1500
              })
            }else{
              let seccionFasesModificarIde : SeccionCursoModificar = new SeccionCursoModificar();
              seccionFasesModificarIde.id = this.seccionCurso.idSeccionCurso
              seccionFasesModificarIde.descripcion = this.formSeccionCurso.value.descripcion
              seccionFasesModificarIde.fase = this.formSeccionCurso.value.fase
              seccionFasesModificarIde.idCurso = this.seccionCurso.idCurso
              seccionFasesModificarIde.idEstado = this.formSeccionCurso.value.estado
              this.servicioModificar.actualizarSeccionCurso(seccionFasesModificarIde).subscribe(resSeccionMod=>{
                if(existeSeccionEstado.length == 0 || existeSeccionFase.length > 0){
                  if(existeSeccionFase.length > 0){
                    for (let iSecInac = 0; iSecInac < existeSeccionFase.length; iSecInac++) {
                      const elementSecInac = existeSeccionFase[iSecInac];
                      let seccionFasesModificar : SeccionCursoModificar = new SeccionCursoModificar();
                      seccionFasesModificar.id = elementSecInac.idSeccionCurso
                      seccionFasesModificar.descripcion = elementSecInac.descripcion
                      if(this.seccionCurso.fase > restaNumero || ((existeSeccionEstado.length >= 0 && this.formSeccionCurso.value.estado == 12) || (this.formSeccionCurso.value.estado == 13 && this.seccionCurso.fase < restaNumero))){
                        seccionFasesModificar.fase = (elementSecInac.fase)+(this.seccionCurso.fase - this.formSeccionCurso.value.fase)
                      }else{
                        seccionFasesModificar.fase = (elementSecInac.fase)-(this.seccionCurso.fase - this.formSeccionCurso.value.fase)
                      }
                      seccionFasesModificar.idCurso = elementSecInac.idCurso
                      seccionFasesModificar.idEstado = elementSecInac.idEstado
                      this.servicioModificar.actualizarSeccionCurso(seccionFasesModificar).subscribe(resSeccionMod=>{
                        if((iSecInac+1) == existeSeccionFase.length){
                          document.getElementById('snipperModificarSeccionCurso')?.setAttribute('style', 'display: none;')
                          Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Se modifico correctamente la sección!',
                            showConfirmButton: false,
                            timer: 1500
                          })
                        }
                      }, error => {
                        document.getElementById('snipperModificarSeccionCurso')?.setAttribute('style', 'display: none;')
                        Swal.fire({
                          position: 'center',
                          icon: 'error',
                          title: 'Hubo un error al modificar la sección de todas estado 12!',
                          showConfirmButton: false,
                          timer: 1500
                        })
                      });
                    }
                  }else{
                    document.getElementById('snipperModificarSeccionCurso')?.setAttribute('style', 'display: none;')
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: 'Se modifico correctamente la sección!',
                      showConfirmButton: false,
                      timer: 1500
                    })
                  }
                }else{
                  document.getElementById('snipperModificarSeccionCurso')?.setAttribute('style', 'display: none;')
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Se modifico correctamente la sección!',
                    showConfirmButton: false,
                    timer: 1500
                  })
                }
              }, error => {
                document.getElementById('snipperModificarSeccionCurso')?.setAttribute('style', 'display: none;')
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'Hubo un error al modificar la sección!',
                  showConfirmButton: false,
                  timer: 1500
                })
              });
            }
          }
        })
      }else{
        document.getElementById('snipperModificarSeccionCurso')?.setAttribute('style', 'display: none;')
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El campo esta vacio!',
          showConfirmButton: false,
          timer: 1500
        })
      }
    }else{
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'El campo esta vacio!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

}
