import { Estado } from "./estado";
import { PreguntaEvaluacion } from "./preguntaEvaluacion";
import { RespuestaEvaluacion } from "./respuestaEvalucion";
import { Usuario } from "./usuario";

export class EvaluacionSeccionEstudiante{
  public id: number=0;
  idPreguntaEvaluacion !: PreguntaEvaluacion;
  idRespuestaEvaluacion !: RespuestaEvaluacion;
  idUsuario !: Usuario;
  idEstado !: Estado;
}
