import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide = true;
  public formLogin!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private servicioUsuario : UsuarioService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.formLogin = this.fb.group({
      username: [null,Validators.required],
      password: [null,Validators.required]
    });
  }

  login(){
    this.servicioUsuario.listarTodos().subscribe(resUsuarios=>{
      const username = this.formLogin.controls['username'].value;
      const encontrarUsuario = resUsuarios.find((usuario:any) => usuario.documento == username);
      if(encontrarUsuario != undefined){
        const contrasena = encontrarUsuario.password.toString()
        var bytes  = CryptoJS.AES.decrypt(contrasena, 'secret key 123');
        var decryptedData = JSON.stringify(bytes.toString(CryptoJS.enc.Utf8));
        var contrasenaDesencrip = decryptedData.slice(3, -3)
        console.log(contrasenaDesencrip, encontrarUsuario)
        if(contrasenaDesencrip == this.formLogin.controls['password'].value){
          const encontrarActivo = resUsuarios.find((usuario:any) => usuario.idEstado.id == 6);
          if(encontrarActivo){
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Bienvenido(a)!',
              showConfirmButton: false,
              timer: 1500
            })
            sessionStorage.setItem('usuario', String(encontrarUsuario.documento))
            sessionStorage.setItem('id', String(encontrarUsuario.id))
            this.router.navigate(['/vista']);
          }else{
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Usuario inactivo!!',
              showConfirmButton: false,
              timer: 1500
            })
          }
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Contraseña incorrecta',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Usuario no registrado',
          showConfirmButton: false,
          timer: 1500
        })
        this.formLogin.reset();
      }
    })
  }
}
