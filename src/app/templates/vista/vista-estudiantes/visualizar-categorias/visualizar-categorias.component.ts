import { Component } from '@angular/core';
import { CategoriaService } from 'src/app/services/categoria.service';
import { CanActivate, Router } from '@angular/router';

@Component({
  selector: 'app-visualizar-categorias',
  templateUrl: './visualizar-categorias.component.html',
  styleUrls: ['./visualizar-categorias.component.css']
})
export class VisualizarCategoriasComponent {

  public listaCategorias: any = [];

  constructor(
    private servicioCategorias: CategoriaService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.listarCategorias();
  }

  public listarCategorias(){
    this.servicioCategorias.listarTodos().subscribe(res=>{
      this.listaCategorias = res
    })
  }

  public abrirCurso(id: number){
    this.router.navigate(['/vista/cursosEstudiante', id]);
    setTimeout(()=>{
      location.reload()
    }, 500)
  }
}
