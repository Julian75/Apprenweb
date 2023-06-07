import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EstadoService } from 'src/app/services/estado.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria';

@Component({
  selector: 'app-agregar-categoria',
  templateUrl: './agregar-categoria.component.html',
  styleUrls: ['./agregar-categoria.component.css']
})
export class AgregarCategoriaComponent {

  public formCategoria!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AgregarCategoriaComponent>,
    private servicioCategoria: CategoriaService,
    private servicioEstado: EstadoService
  ) { }


  ngOnInit(): void {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.formCategoria = this.fb.group({
      id: 0,
      descripcion: [null,Validators.required],
    });
  }

  public guardar() {
    if(this.formCategoria.valid){
      document.getElementById('snipper')?.setAttribute('style', 'display: block;')
      this.servicioCategoria.listarTodos().subscribe(resCategoria=>{
        var existeCategoria = resCategoria.filter(categoria=>categoria.descripcion.toUpperCase() == this.formCategoria.controls['descripcion'].value.toUpperCase())
        if(existeCategoria.length > 0){
          if(existeCategoria[0].idEstado.id == 8){
            document.getElementById('snipper')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Esa categoria ya existe!',
              showConfirmButton: false,
              timer: 1500
            })
          }else{
            document.getElementById('snipper')?.setAttribute('style', 'display: none;')
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Esa categoria ya existe, solo que esta inactivo!',
              showConfirmButton: false,
              timer: 1500
            })
          }
        }else{
          this.servicioEstado.listarPorId(8).subscribe(resEstado=>{
            let categoria : Categoria = new Categoria();
            categoria.descripcion = this.formCategoria.value.descripcion.toUpperCase();
            categoria.idEstado = resEstado;
            this.registrarCategoria(categoria);
          })
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

  public registrarCategoria(categoria: Categoria) {
    this.servicioCategoria.registrar(categoria).subscribe(res=>{
      document.getElementById('snipper')?.setAttribute('style', 'display: none;')
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Categoria Registrada!',
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
        title: 'Hubo un error al agregar!',
        showConfirmButton: false,
        timer: 1500
      })
    });
  }
}
