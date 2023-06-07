import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoriaModificar } from 'src/app/models-actualizar/categoriaModificar';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ConsultasGeneralesService } from 'src/app/services/consultasGenerales.service';
import { EstadoService } from 'src/app/services/estado.service';
import { ModificarService } from 'src/app/services/modificar.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-categoria',
  templateUrl: './modificar-categoria.component.html',
  styleUrls: ['./modificar-categoria.component.css']
})
export class ModificarCategoriaComponent {

  public formCategoria!: FormGroup;
  public listaEstados: any = [];
  public listaCategoria: any = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModificarCategoriaComponent>,
    private servicioEstado : EstadoService,
    private servicioCategoria : CategoriaService,
    private servicioModificar : ModificarService,
    private servicioConsultasGenerales : ConsultasGeneralesService,
    @Inject(MAT_DIALOG_DATA) public categoria: MatDialog,
 ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.listarEstados();
    this.listarIdCategoria();
  }

  private crearFormulario() {
    this.formCategoria = this.fb.group({
      id: 0,
      descripcion: [null,Validators.required],
      estado: [null,Validators.required],
    });
  }

  public listarEstados() {
    this.servicioConsultasGenerales.listarEstadosIdModulo(6).subscribe(resEstados=>{
      this.listaEstados = resEstados;
    })
  }

  public listarIdCategoria() {
    this.listaCategoria = this.categoria;
    this.formCategoria.controls['id'].setValue(this.listaCategoria[0].id);
    this.formCategoria.controls['descripcion'].setValue(this.listaCategoria[0].descripcion);
    this.formCategoria.controls['estado'].setValue(this.listaCategoria[0].idEstado.id);
  }

  public guardar() {
    if(this.formCategoria.valid){
      document.getElementById('snipper')?.setAttribute('style', 'display: block;')
      var existeCategoria = this.listaCategoria[1].filter((categoria:any)=> categoria.id != this.listaCategoria[0].id && categoria.descripcion.toUpperCase() == this.formCategoria.value.descripcion.toUpperCase())
      var igualCategoria = this.listaCategoria[1].filter((categoria:any)=> categoria.id == this.listaCategoria[0].id && categoria.descripcion.toUpperCase() == this.formCategoria.value.descripcion.toUpperCase() && categoria.idEstado.id == this.formCategoria.value.estado)
      if(igualCategoria.length > 0){
        document.getElementById('snipper')?.setAttribute('style', 'display: none;')
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'No hubieron cambios!',
          showConfirmButton: false,
          timer: 1500
        })
        this.dialogRef.close()
      }else if(existeCategoria.length > 0){
        if(existeCategoria[0].idEstado.id == 4){
          document.getElementById('snipper')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ya existe esta categoria!',
            showConfirmButton: false,
            timer: 1500
          })
        }else{
          document.getElementById('snipper')?.setAttribute('style', 'display: none;')
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Ya existe esta categoria, solo que esta inactivo!',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }else{
        let categoriaModificar : CategoriaModificar = new CategoriaModificar();
        categoriaModificar.id = this.listaCategoria[0].id
        categoriaModificar.descripcion = this.formCategoria.value.descripcion.toUpperCase()
        categoriaModificar.idEstado = this.formCategoria.value.estado
        this.actualizarCategoria(categoriaModificar)
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

  private actualizarCategoria(categoriaModificar :CategoriaModificar){
    this.servicioModificar.actualizarCategoria(categoriaModificar).subscribe(res => {
      document.getElementById('snipper')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Categoria modificada!',
        showConfirmButton: false,
        timer: 1500
      })
      this.dialogRef.close();
      location.reload();
    }, error => {
      document.getElementById('snipper')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Hubo un error al modificar!',
        showConfirmButton: false,
        timer: 1500
      })
    });
  }
}
