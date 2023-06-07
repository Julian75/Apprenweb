import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SeccionCurso } from 'src/app/models/seccionCurso';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { CursoService } from 'src/app/services/curso.service';
import { EstadoService } from 'src/app/services/estado.service';
import { SeccionCursoService } from 'src/app/services/seccionCurso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-seccion-curso',
  templateUrl: './agregar-seccion-curso.component.html',
  styleUrls: ['./agregar-seccion-curso.component.css']
})
export class AgregarSeccionCursoComponent {

  public formSeccionCurso!: FormGroup;
  public listaFormularioFases: any = [];

  constructor(
    private fb: FormBuilder,
    private servicioEstado: EstadoService,
    private servicioCurso: CursoService,
    private servicioSeccionCurso: SeccionCursoService,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public idCurso: MatDialog,
    public dialogRef: MatDialogRef<AgregarSeccionCursoComponent>,
  ){}

  ngOnInit(): void {
    this.formSeccionCurso = this.fb.group({

    })
  }

  fasesC: any = [];
  generarFases(cantidad: any){
    document.getElementById("fasesCantidad")?.setAttribute("style", "display: none;")
    this.fasesC = []
    var generacion = Number(cantidad.target.value)
    this.servicioConsultasGenerales.listarSeccionesCurso(Number(this.idCurso)).subscribe(resSeccionesCurso=>{
      for (let i = 0; i < generacion; i++) {
        var index = i+Number(resSeccionesCurso.length)
        this.fasesC.push(index+1)
      }
      if(Number(cantidad.target.value) == 0){
        this.fasesC = []
        this.listaFormularioFases = []
      }else if(Number(cantidad.target.value) > 0){ document.getElementById("fasesCantidad")?.setAttribute("style", "display: block;") }
    })
  }

  almacenarDatos(descripcion: any, fase: number){
    var obj = {
      descripcion: descripcion.target.value,
      id: fase
    }
    if(descripcion.target.value != ""){
      if(this.listaFormularioFases.length > 0){
        var filtrarFase = this.listaFormularioFases.filter((faseR: any)=> faseR.id == fase)
        if(filtrarFase.length > 0){
          var index = this.listaFormularioFases.findIndex((faseCon: any) => faseCon.id == filtrarFase[0].id);
          this.listaFormularioFases[index].descripcion = descripcion.target.value
        }else{
          this.listaFormularioFases.push(obj)
        }
      }else{
        this.listaFormularioFases.push(obj)
      }
    }else{
      if(this.listaFormularioFases.length > 0){
        var filtrarFase = this.listaFormularioFases.filter((faseR: any)=> faseR.id == fase)
        if(filtrarFase.length > 0){
          var index = this.listaFormularioFases.findIndex((faseCon: any) => faseCon.id == filtrarFase[0].id);
          this.listaFormularioFases.splice(index, 1)
        }
      }
    }
  }

  public guardar(){
    if(this.listaFormularioFases.length > 0 && this.fasesC.length > 0 && this.listaFormularioFases.length == this.fasesC.length){
      document.getElementById("snipperAgregarSeccionCurso")?.setAttribute("style", "display: block;")
      this.servicioCurso.listarPorId(Number(this.idCurso)).subscribe(resCursoIde=>{
        for (let iFormFase = 0; iFormFase < this.listaFormularioFases.length; iFormFase++) {
          const elementFormFases = this.listaFormularioFases[iFormFase];
          this.servicioEstado.listarPorId(12).subscribe(resEstado=>{
            let seccionFases : SeccionCurso = new SeccionCurso();
            seccionFases.id = elementFormFases.id
            seccionFases.fase = elementFormFases.id
            seccionFases.descripcion = elementFormFases.descripcion.toUpperCase()
            seccionFases.idCurso = resCursoIde
            seccionFases.idEstado = resEstado
            this.registrarSecciones(seccionFases, iFormFase, this.listaFormularioFases.length);
          })
        }
      })
    }else{
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Los campos estan vacio!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  registrarSecciones(seccionFases: SeccionCurso, indexForm: number, length: number){
    this.servicioSeccionCurso.registrar(seccionFases).subscribe(resSeccionR=>{
      if((indexForm+1) == length){
        document.getElementById("snipperAgregarSeccionCurso")?.setAttribute("style", "display: none;")
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se registro la sección!',
          showConfirmButton: false,
          timer: 1500
        })
        this.dialogRef.close();
        location.reload()
      }
    }, error => {
      document.getElementById("snipperAgregarSeccionCurso")?.setAttribute("style", "display: none;")
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Genero un error al registrar!',
        showConfirmButton: false,
        timer: 1500
      })
    })
  }

}
