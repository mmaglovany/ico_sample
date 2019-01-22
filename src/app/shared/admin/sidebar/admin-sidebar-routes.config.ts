import {RouteInfo} from './admin-sidebar.metadata';

export const ROUTES: RouteInfo[] = [

    {
        path: '/admin',
        title: 'Admin Dashboard',
        icon: 'fa fa-tachometer',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: []
    },
    {
        path: '/admin/ico-history',
        title: 'Ico transactions history',
        icon: 'fa fa-history',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: []
    },
    {
        path: '/admin/user-list',
        title: 'User List',
        icon: 'fa fa-users',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: []
    },
    {
        path: '/admin/ico-settings',
        title: 'Ico Settings',
        icon: 'ft-settings',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: []
    },
    {
        path: '/admin/admin-settings',
        title: 'User Settings',
        icon: 'ft-settings',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: []
    }

];
