import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EstadoService } from 'src/app/services/estado.service';
import { ModuloService } from 'src/app/services/modulo.service';
import { Estado } from 'src/app/models/estado';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';

@Component({
  selector: 'app-agregar-estado',
  templateUrl: './agregar-estado.component.html',
  styleUrls: ['./agregar-estado.component.css']
})
export class AgregarEstadoComponent {

  public formEstado!: FormGroup;
  public listaModulos:any = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AgregarEstadoComponent>,
    private servicioConsultasGenerales: ConsultasGeneralesService,
    private servicioModulo: ModuloService,
    private servicioEstado: EstadoService
  ) { }


  ngOnInit(): void {
    this.crearFormulario();
    this.listarModulos();
  }

  private crearFormulario() {
    this.formEstado = this.fb.group({
      id: 0,
      descripcion: [null,Validators.required],
      observacion: [null,Validators.required],
      modulo: [null,Validators.required],
    });
  }

  public listarModulos() {
    this.servicioModulo.listarTodos().subscribe(res => {
      this.listaModulos = res;
    });
  }

  public guardar() {
    if(this.formEstado.valid){
      document.getElementById('snipperAgregarEstado')?.setAttribute('style', 'display: block;')
      this.servicioConsultasGenerales.listarEstados().subscribe(res =>{
        var existeEstadoModulo = res.filter(estado=> estado.descripcion.toUpperCase() == this.formEstado.value.descripcion.toUpperCase() && estado.idModulo == this.formEstado.value.modulo.id)
        if(existeEstadoModulo.length > 0){
          document.getElementById('snipperAgregarEstado')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ya existe ese estado para ese modulo!',
            showConfirmButton: false,
            timer: 1500
          })
        }else{
          let estadoRegistrar : Estado = new Estado();
          estadoRegistrar.idModulo = this.formEstado.value.modulo
          estadoRegistrar.descripcion = this.formEstado.value.descripcion.toUpperCase()
          estadoRegistrar.observacion = this.formEstado.value.observacion.toUpperCase()
          this.registrarEstado(estadoRegistrar);
        }
      })
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

  public registrarEstado(estado: Estado) {
    this.servicioEstado.registrar(estado).subscribe(res=>{
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Estado Registrado!',
        showConfirmButton: false,
        timer: 1500
      })
      this.dialogRef.close();
      location.reload();
      document.getElementById('snipperAgregarEstado')?.setAttribute('style', 'display: none;')
    }, error => {
      document.getElementById('snipperAgregarEstado')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Hubo un error al agregar!',
        showConfirmButton: false,
        timer: 1500
      })
    });
  }

}
