import { Estado } from "./estado";

export class TipoDocumento {
  public id: number=0;
  public descripcion: string="";
  idEstado !: Estado;
}
