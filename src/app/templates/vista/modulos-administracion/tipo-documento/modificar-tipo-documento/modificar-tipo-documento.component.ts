import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TipoDocumentoModificar } from 'src/app/models-actualizar/tipoDocumentoModificar';
import { TipoDocumento } from 'src/app/models/tipoDocumento';
import { EstadoService } from 'src/app/services/estado.service';
import { ModificarService } from 'src/app/services/modificar.service';
import { TipoDocumentoService } from 'src/app/services/tipoDocumento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-tipo-documento',
  templateUrl: './modificar-tipo-documento.component.html',
  styleUrls: ['./modificar-tipo-documento.component.css']
})
export class ModificarTipoDocumentoComponent {

  public formTipoDocumento!: FormGroup;
  public listaEstados: any = [];
  public listaTipoDocumentoIde: any = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModificarTipoDocumentoComponent>,
    private servicioTipoDocumento: TipoDocumentoService,
    private servicioEstado: EstadoService,
    private servicioModificar: ModificarService,
    @Inject(MAT_DIALOG_DATA) public tipoDocumento: MatDialog,
  ) { }


  ngOnInit(): void {
    this.crearFormulario();
    this.listarEstados();
    this.listarEstadoIde();
  }

  private crearFormulario() {
    this.formTipoDocumento = this.fb.group({
      id: 0,
      descripcion: [null,Validators.required],
      estado: [null,Validators.required]
    });
  }

  private listarEstados(){
    this.servicioEstado.listarTodos().subscribe(resEstados=>{
      this.listaEstados = resEstados.filter(estado=> estado.idModulo.id == 3)
    })
  }

  private listarEstadoIde(){
    this.listaTipoDocumentoIde = this.tipoDocumento
    this.formTipoDocumento.controls['id'].setValue(this.listaTipoDocumentoIde[0].id);
    this.formTipoDocumento.controls['descripcion'].setValue(this.listaTipoDocumentoIde[0].descripcion);
    this.formTipoDocumento.controls['estado'].setValue(this.listaTipoDocumentoIde[0].idEstado.id);
  }

  public guardar() {
    if(this.formTipoDocumento.valid){
      document.getElementById('snipperModificarTipoDocumento')?.setAttribute('style', 'display: block;')
      var igualTiposDocumentos = this.listaTipoDocumentoIde[1].filter((tipoDocumento: any)=>tipoDocumento.id == this.listaTipoDocumentoIde[0].id && tipoDocumento.descripcion.toUpperCase() == this.formTipoDocumento.value.descripcion.toUpperCase() && tipoDocumento.idEstado.id == this.formTipoDocumento.value.estado)
      var existeTiposDocumentos = this.listaTipoDocumentoIde[1].filter((tipoDocumento: any)=>tipoDocumento.id != this.listaTipoDocumentoIde[0].id && tipoDocumento.descripcion.toUpperCase() == this.formTipoDocumento.value.descripcion.toUpperCase())
      if(igualTiposDocumentos.length > 0){
        document.getElementById('snipperModificarTipoDocumento')?.setAttribute('style', 'display: none;')
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'No hubieron cambios!',
          showConfirmButton: false,
          timer: 1500
        })
      }else if(existeTiposDocumentos.length > 0){
        if(existeTiposDocumentos[0].idEstado.id == 2){
          document.getElementById('snipperModificarTipoDocumento')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ese tipo de documento ya existe!',
            showConfirmButton: false,
            timer: 1500
          })
        }else{
          document.getElementById('snipperModificarTipoDocumento')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ese tipo de documento ya existe, solo que esta inactivo!',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }else{
        let tipoDocumentoModificar : TipoDocumentoModificar = new TipoDocumentoModificar();
        tipoDocumentoModificar.id = this.listaTipoDocumentoIde[0].id
        tipoDocumentoModificar.descripcion = this.formTipoDocumento.value.descripcion.toUpperCase();
        tipoDocumentoModificar.idEstado = this.formTipoDocumento.value.estado;
        this.actualizarTipoDocumento(tipoDocumentoModificar);
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

  public actualizarTipoDocumento(tipoDocumentoModificar: TipoDocumentoModificar) {
    this.servicioModificar.actualizarTipoDocumento(tipoDocumentoModificar).subscribe(res=>{
      document.getElementById('snipperModificarTipoDocumento')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Tipo Documento Actualizado!',
        showConfirmButton: false,
        timer: 1500
      })
      this.dialogRef.close();
      location.reload();
    }, error => {
      document.getElementById('snipperModificarTipoDocumento')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Hubo un error al actualizar!',
        showConfirmButton: false,
        timer: 1500
      })
    });
  }
}
