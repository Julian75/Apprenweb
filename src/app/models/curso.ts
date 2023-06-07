import { Categoria } from "./categoria";
import { Estado } from "./estado";
import { Usuario } from "./usuario";

export class Curso{
  public id: number=0;
  public titulo: string="";
  public descripcion: string="";
  idCategoria !: Categoria;
  idUsuario !: Usuario;
  idEstado !: Estado;
}
