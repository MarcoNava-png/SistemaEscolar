import { INavbarData } from '../components/shared/sidebar/helper';

export const modules: INavbarData[] = [
  {
    routeLink: '/dashboard',
    icon: 'fa fa-home',
    label: 'Dashboard'
  },
  {
    routeLink: '/alumnos',
    icon: 'fa fa-user-graduate',
    label: 'Alumnos',
    items: [
      { routeLink: '/alumnos/lista', label: 'Lista de Alumnos', icon: 'fa fa-list' },
      { routeLink: '/alumnos/agregar', label: 'Agregar Alumno', icon: 'fa fa-plus' }
    ]
  },
  {
    routeLink: '/maestros',
    icon: 'fa fa-chalkboard-teacher',
    label: 'Maestros',
    items: [
      { routeLink: '/maestros/lista', label: 'Lista de Maestros', icon: 'fa fa-list' }
    ]
  }
];
