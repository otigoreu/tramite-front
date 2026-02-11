import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  inject,
  WritableSignal,
  input,
  signal,
  ChangeDetectorRef,
} from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { MatDialog } from '@angular/material/dialog';
import { navItems } from '../sidebar/sidebar-data';
import { TranslateService } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { Router, RouterModule, Routes } from '@angular/router';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AuthService } from 'src/app/service/auth.service';
import { ChangePasswordComponent } from 'src/app/pages/Authentication/change-Password/change-Password.component';
import { A11yModule } from '@angular/cdk/a11y';
import { AplicacionService } from 'src/app/service/aplicacion.service';
import { MenuService } from 'src/app/service/menu.service';
import { NavItem } from '../sidebar/nav-item/nav-item';
import {
  notify1,
  notify12,
  notify13,
  notify14,
  notify6,
} from 'src/app/data/mensajes.data';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
import { NotificationsService } from 'angular2-notifications';
import { EntidadService } from 'src/app/service/entidad.service';
import { Aplicacion } from 'src/app/pages/aplicacion/Modals/Aplicacion';
import { routes } from 'src/app/app.routes';
import { MenuInfo } from 'src/app/model/menu';

// import { AuthService } from 'src/app/service/auth.service';

// import { ChangePasswordComponent } from 'src/app/pages/Authentication/change-Password/change-Password.component';
//--------------------------------------------------------///
export function extractRoutePaths(routes: Routes): string[] {
  const paths: string[] = [];

  function collectPaths(routeList: Routes, parentPath: string = '') {
    routeList.forEach((route) => {
      const fullPath = parentPath + '' + (route.path || '');
      if (route.path) {
        paths.push(fullPath.replace('//', '/'));
      }
      if (route.children) {
        collectPaths(route.children, fullPath);
      }
    });
  }

  collectPaths(routes);
  return paths;
}








//--------------------------------------------------------///
interface notifications {
  id: number;
  img: string;
  title: string;
  subtitle: string;
}

interface profiledd {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface apps {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface quicklinks {
  id: number;
  title: string;
  link: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
    UpperCasePipe,
    FormsModule,
    A11yModule,
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  authService = inject(AuthService);
  rolId: number | null = null;
  rolesHeader = this.authService.roles();

  // authService = inject(AuthService);

  showFiller = false;

  public selectedLanguage: any = {
    language: 'Español',
    code: 'es',
    type: 'Pe',
    icon: '/assets/images/flag/icon-flag-es.svg',
  };

  public languages: any[] = [
    {
      language: 'English',
      code: 'en',
      type: 'US',
      icon: '/assets/images/flag/icon-flag-en.svg',
    },
    {
      language: 'Español',
      code: 'es',
      icon: '/assets/images/flag/icon-flag-es.svg',
    },
    {
      language: 'Français',
      code: 'fr',
      icon: '/assets/images/flag/icon-flag-fr.svg',
    },
    {
      language: 'German',
      code: 'de',
      icon: '/assets/images/flag/icon-flag-de.svg',
    },
  ];

  aplicacionHeader: string;
  entidadHeader: string;
  appservice = inject(AplicacionService);
  entidadservice = inject(EntidadService);
  menuService = inject(MenuService);
  firstOptionMenu = signal('');
  notificationsHEader = inject(NotificationsService);
  router = inject(Router);
  notificationsHeader = inject(NotificationsService);

  constructor(
    private vsidenav: CoreService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private cd: ChangeDetectorRef
  ) {
    translate.setDefaultLang('es');
    const aplicacion = localStorage.getItem('Aplicacion');
    const entidad = localStorage.getItem('entidad');

    if (aplicacion && entidad) {
      this.aplicacionHeader = aplicacion;
      this.entidadHeader = entidad;
    }
  }

  cambiarRol(idRol: string, nameRol: string) {

    if (this.authService.userRole() == nameRol) {
      this.notificationsHEader.set(notify13, true);

      console.log('no va cambiar de Rol');
    } else {


      this.appservice
        .GetByAplicationPerRol(idRol)
        .subscribe((appRol: Aplicacion) => {

          console.log('va cambiar de Rol');
         const allPaths = extractRoutePaths(routes);
         console.log('paths:', allPaths);

          this.menuService.getDataAllByRol(idRol).subscribe((data:MenuInfo[])=>{
            if(!data.some(item=> allPaths.includes(item.ruta))){

                  this.notificationsHEader.set(notify14, true);
                }
            else{
              this.menuService.GetByAplicationAsync(appRol.id).subscribe({
            next: (data: any[]) => {
              navItems.length = 0;
              data.forEach((nav) => {
                if (!nav.idMenuPadre) {
                  const navItem: NavItem = {
                    id: nav.id,
                    displayName: nav.descripcion,
                    iconName: nav.icono,
                    route: nav.ruta,
                    children: [],
                  };

                  navItems.push(navItem);
                  this.firstOptionMenu.set(navItems[0].route!);
                }
              });
              navItems.forEach((parentNav: NavItem) => {
                parentNav.children = data.filter(
                  (nav) => nav.idMenuPadre === parentNav.id
                );
              });

              this.authService.aplicacion.set(appRol.descripcion);
              this.authService.idAplicacion.set(appRol.id.toString());
              localStorage.setItem('Aplicacion', this.authService.aplicacion());
              localStorage.setItem(
                'idAplicacion',
                this.authService.idAplicacion()
              );
              this.aplicacionHeader = this.authService.aplicacion();

              this.authService.userRole.set(nameRol);
              this.authService.userIdRol.set(idRol);

              localStorage.setItem('userRole', this.authService.userRole());
              localStorage.setItem('userIdRol', this.authService.userIdRol());

              this.entidadservice
                .GetByEntidadPerRol(this.authService.userIdRol())
                .subscribe((entidadRol) => {
                  this.authService.entidad.set(entidadRol.descripcion);
                  localStorage.setItem('entidad', this.authService.entidad());
                  this.authService.idEntidad.set(entidadRol.id.toString());
                  localStorage.setItem(
                    'idEntidad',
                    this.authService.idEntidad()
                  );

                  this.entidadHeader = this.authService.entidad();
                });

              this.router.navigate([this.firstOptionMenu()]);
              this.notificationsHEader.set(notify12, true);
            },
            error: (err) => {
              console.error('Error al obtener menú:', err);
              this.notificationsHEader.info(
                ...NotificationMessages.info('El Rol no tiene Menus asignados.')
              );
            },
          });

            }
          });



        });
    }
  }

  openDialog() {
    this.dialog.open(ChangePasswordComponent);
    console.log('roles con authService', this.authService.roles());
    console.log('Roles con Variable', this.rolesHeader);
  }

  changeLanguage(lang: any): void {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
  }

  notifications: notifications[] = [];

  notifications1: notifications[] = [
    {
      id: 1,
      img: '/assets/images/profile/user-1.jpg',
      title: 'Roman Joined thes Team!',
      subtitle: 'Congratulate him',
    },
    {
      id: 2,
      img: '/assets/images/profile/user-2.jpg',
      title: 'New message received',
      subtitle: 'Salma sent you new message',
    },
    {
      id: 3,
      img: '/assets/images/profile/user-3.jpg',
      title: 'New Payment received',
      subtitle: 'Check your earnings',
    },
    {
      id: 4,
      img: '/assets/images/profile/user-4.jpg',
      title: 'Jolly completed tasks',
      subtitle: 'Assign her new tasks',
    },
    {
      id: 5,
      img: '/assets/images/profile/user-5.jpg',
      title: 'Roman Joined the Team!',
      subtitle: 'Congratulatse him',
    },
  ];

  profiledd: profiledd[] = [
    {
      id: 1,
      img: '/assets/images/svgs/icon-account.svg',
      title: 'Mi perfil',
      subtitle: 'Configuraciones de la cuenta',
      link: '/change-password',
    },
    {
      id: 2,
      img: '/assets/images/svgs/icon-inbox.svg',
      title: 'Mi bandeja de entrada',
      subtitle: 'Mensajes y correo electrónico',
      link: '/apps/email/inbox',
    },
    {
      id: 3,
      img: '/assets/images/svgs/icon-tasks.svg',
      title: 'Mis tareas',
      subtitle: 'Tareas diarias y pendientes',
      link: '/apps/taskboard',
    },
  ];

  apps: apps[] = [
    {
      id: 1,
      img: '/assets/images/svgs/icon-dd-chat.svg',
      title: 'Chat Application',
      subtitle: 'Messages & Emails',
      link: '/apps/chat',
    },
    {
      id: 2,
      img: '/assets/images/svgs/icon-dd-cart.svg',
      title: 'Todo App',
      subtitle: 'Completed task',
      link: '/apps/todo',
    },
    {
      id: 3,
      img: '/assets/images/svgs/icon-dd-invoice.svg',
      title: 'Invoice App',
      subtitle: 'Get latest invoice',
      link: '/apps/invoice',
    },
    {
      id: 4,
      img: '/assets/images/svgs/icon-dd-date.svg',
      title: 'Calendar App',
      subtitle: 'Get Dates',
      link: '/apps/calendar',
    },
    {
      id: 5,
      img: '/assets/images/svgs/icon-dd-mobile.svg',
      title: 'Contact Application',
      subtitle: '2 Unsaved Contacts',
      link: '/apps/contacts',
    },
    {
      id: 6,
      img: '/assets/images/svgs/icon-dd-lifebuoy.svg',
      title: 'Tickets App',
      subtitle: 'Create new ticket',
      link: '/apps/tickets',
    },
    {
      id: 7,
      img: '/assets/images/svgs/icon-dd-message-box.svg',
      title: 'Email App',
      subtitle: 'Get new emails',
      link: '/apps/email/inbox',
    },
    {
      id: 8,
      img: '/assets/images/svgs/icon-dd-application.svg',
      title: 'Courses',
      subtitle: 'Create new course',
      link: '/apps/courses',
    },
  ];

  quicklinks: quicklinks[] = [
    {
      id: 1,
      title: 'Pricing Page',
      link: '/theme-pages/pricing',
    },
    {
      id: 2,
      title: 'Authentication Design',
      link: '/authentication/login',
    },
    {
      id: 3,
      title: 'Register Now',
      link: '/authentication/side-register',
    },
    {
      id: 4,
      title: '404 Error Page',
      link: '/authentication/error',
    },
    {
      id: 5,
      title: 'Notes App',
      link: '/apps/notes',
    },
    {
      id: 6,
      title: 'Employee App',
      link: '/apps/employee',
    },
    {
      id: 7,
      title: 'Todo Application',
      link: '/apps/todo',
    },
    {
      id: 8,
      title: 'Treeview',
      link: '/theme-pages/treeview',
    },
  ];
}

@Component({
  selector: 'search-dialog',
  standalone: true,
  imports: [RouterModule, MaterialModule, TablerIconsModule, FormsModule],
  templateUrl: 'search-dialog.component.html',
})
export class AppSearchDialogComponent {
  searchText: string = '';
  navItems = navItems;

  navItemsData = navItems.filter((navitem) => navitem.displayName);

  // filtered = this.navItemsData.find((obj) => {
  //   return obj.displayName == this.searchinput;
  // });
}
