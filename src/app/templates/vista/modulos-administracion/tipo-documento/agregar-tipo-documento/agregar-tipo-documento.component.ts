import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TipoDocumento } from 'src/app/models/tipoDocumento';
import { EstadoService } from 'src/app/services/estado.service';
import { TipoDocumentoService } from 'src/app/services/tipoDocumento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-tipo-documento',
  templateUrl: './agregar-tipo-documento.component.html',
  styleUrls: ['./agregar-tipo-documento.component.css']
})
export class AgregarTipoDocumentoComponent {

  public formTipoDocumento!: FormGroup;
  public listaTiposDocumentos: any = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AgregarTipoDocumentoComponent>,
    private servicioTipoDocumento: TipoDocumentoService,
    private servicioEstado: EstadoService,
    @Inject(MAT_DIALOG_DATA) public listaTipDoc: MatDialog,
  ) { }


  ngOnInit(): void {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.listaTiposDocumentos = this.listaTipDoc
    this.formTipoDocumento = this.fb.group({
      id: 0,
      descripcion: [null,Validators.required],
    });
  }

  public guardar() {
    if(this.formTipoDocumento.valid){
      document.getElementById('snipperAgregarTipoDocumento')?.setAttribute('style', 'display: block;')
        var existeTiposDocumentos = this.listaTiposDocumentos.filter((tipoDocumento: any)=>tipoDocumento.descripcion.toUpperCase() == this.formTipoDocumento.value.descripcion.toUpperCase())
        if(existeTiposDocumentos.length > 0){
          if(existeTiposDocumentos[0].idEstado.id == 2){
            document.getElementById('snipperAgregarTipoDocumento')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Ese tipo de documento ya existe!',
              showConfirmButton: false,
              timer: 1500
            })
          }else{
            document.getElementById('snipperAgregarTipoDocumento')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Ese tipo de documento ya existe, solo que esta inactivo!',
              showConfirmButton: false,
              timer: 1500
            })
          }
        }else{
          this.servicioEstado.listarPorId(2).subscribe(resEstadoTipoDocumentoActivo=>{
            let tipoDocumentoRegistrar : TipoDocumento = new TipoDocumento();
            tipoDocumentoRegistrar.descripcion = this.formTipoDocumento.value.descripcion.toUpperCase();
            tipoDocumentoRegistrar.idEstado = resEstadoTipoDocumentoActivo;
            this.registrarTipoDocumento(tipoDocumentoRegistrar);
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

  public registrarTipoDocumento(tipoDocumentoRegistrar: TipoDocumento) {
    this.servicioTipoDocumento.registrar(tipoDocumentoRegistrar).subscribe(res=>{
      document.getElementById('snipperAgregarTipoDocumento')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Tipo Documento Registrado!',
        showConfirmButton: false,
        timer: 1500
      })
      this.dialogRef.close();
      location.reload();
    }, error => {
      document.getElementById('snipperAgregarTipoDocumento')?.setAttribute('style', 'display: none;')
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
