// src/app/shared/constants/notification-messages.ts
import { IconsNotify } from './icons.data';

export class NotificationMessages {
  static successCreate(entity = 'registro'): [string, string, any?] {
    return [
      'Creación exitosa',
      `El ${entity} fue creado correctamente.`,
      { icon: IconsNotify.Success },
    ];
  }

  static successUpdate(entity = 'registro'): [string, string, any?] {
    return [
      'Actualización exitosa',
      `El ${entity} fue actualizado correctamente.`,
      { icon: IconsNotify.Success },
    ];
  }

  static successDelete(entity = 'registro'): [string, string, any?] {
    return [
      'Eliminación exitosa',
      `El ${entity} fue eliminado correctamente.`,
      { icon: IconsNotify.Success },
    ];
  }

  static error(
    message = 'Ocurrió un error inesperado.'
  ): [string, string, any?] {
    return ['Error', message, { icon: IconsNotify.Error }];
  }

  static warning(message = 'Acción no permitida'): [string, string, any?] {
    return ['Advertencia', message, { icon: IconsNotify.Warn }];
  }

  static info(message = 'Información relevante'): [string, string, any?] {
    return ['Info', message, { icon: IconsNotify.Info }];
  }

  static success(
    message = 'Operación realizada con éxito.'
  ): [string, string, any?] {
    return ['Éxito', message, { icon: IconsNotify.Success }];
  }

  static successActualizar(title: string): [string, string, any?] {
    return [
      'Éxito',
      `${title} actualizado(a) con éxito.`,
      { icon: IconsNotify.Success },
    ];
  }

  static successCrear(title: string): [string, string, any?] {
    return [
      'Éxito',
      `${title} guardado(a) con éxito.`,
      { icon: IconsNotify.Success },
    ];
  }
}
