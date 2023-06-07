import { Estado } from "./estado";
import { PreguntaEvaluacion } from "./preguntaEvaluacion";

export class RespuestaEvaluacion{
  public id: number=0;
  public descripcion: string="";
  public correcta: boolean=false;
  idPreguntaEvaluacion !: PreguntaEvaluacion;
  idEstado !: Estado;
}
