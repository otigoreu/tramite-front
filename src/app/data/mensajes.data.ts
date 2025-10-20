import { Icon123, IconAlertCircleOff, IconError404, IconError404Off } from "angular-tabler-icons/icons";
import { NotificationType, Notification, NotificationAnimationType } from "angular2-notifications";
import { IconsNotify } from "./icons.data";



export const menssageNoti:Notification[]=[
  {
    type:NotificationType.Success,
    icon: IconsNotify.Success ,
    title:'Inicio de sesión exitoso',
    content: 'Bienvenido a Tramite Goreu',


  },
   {
    type:NotificationType.Success,
    icon: IconsNotify.Success,
    title:'Registro exitoso',
    content: 'Bienvenido',

  },
 {
    type:NotificationType.Warn,
    icon: IconsNotify.Warn,
    title:'Registro Fallido',
    content: 'Intenta otra vez',

  },
{
    type:NotificationType.Success,
    icon: IconsNotify.Success,
    title:'Contraseña actualizada',
    content: 'Inicie sesión',

  },
   {
    type:NotificationType.Info,
    icon: IconsNotify.Info,
    title:'Sesión Cerrada',
    content: 'Hasta Luego',

  },

   {
    type:NotificationType.Error,
    icon: IconsNotify.Error,
    title:'Inicio de sesión Fallido',
    content: 'Revise sus credenciales'

  },

   {
    type:NotificationType.Alert,
    icon: IconsNotify.Alert,
    title:'Envio Fallido',
    content: 'Revise que su correo electrónico y el token sean correctos',

  },
  {
    type:NotificationType.Success,
    icon: IconsNotify.Success,
    title:'Token enviado',
    content: 'Revise cu correo electrónico por favor',

  },
   {
    type:NotificationType.Error,
    icon: IconsNotify.Error,
    title:'Envio Fallido',
    content: 'Su correo no se encuentra Registrado',

  },
   {
    type:NotificationType.Success,
    icon: IconsNotify.Success ,
    title:'Cambio de contraseña exitoso',
    content: 'Use su nueva contraseña al iniciar sesión',


  },
  {
    type:NotificationType.Warn,
    icon: IconsNotify.Warn,
    title:'contraseña actual Incorrecta',
    content: 'Intenta otra vez',

  },
  {
    type:NotificationType.Info,
    icon: IconsNotify.Info,
    title:'Usted ha cambiado de Rol',
    content: 'El menu principal presentará cambios',

  },
  {
    type:NotificationType.Info,
    icon: IconsNotify.Info,
    title:'Usted ya tiene este Rol Seleccionado',
    content: 'Asegurese de elegir un Rol diferente',

  }


]

export const[
  notify1,
  notify2,
  notify3,
  notify4,
  notify5,
  notify6,
  notify7,
  notify8,
  notify9,
  notify10,
  notify11,
  notify12,
   notify13,

] =menssageNoti
