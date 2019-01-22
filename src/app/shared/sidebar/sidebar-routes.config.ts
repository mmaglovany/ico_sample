import {RouteInfo} from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [

    {
        path: '/',
        title: 'Dashboard',
        icon: 'fa fa-tachometer',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: []
    },
    {
        path: '/ico',
        title: 'ICO',
        icon: 'fa fa-exchange',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: []
    },
    {
        path: '/referrals',
        title: 'Affiliate',
        icon: 'fa fa-share-alt',
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [
            {
                path: '/referrals/members',
                title: 'Members',
                icon: 'fa fa-list',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/referrals/network-tree',
                title: 'Network tree',
                icon: 'fa fa-plus-square-o',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
        ]
    },
    {
        path: '/wallet',
        title: 'Wallet',
        icon: 'icon-wallet',
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [
            {
                path: '/wallet/deposits',
                title: 'Wallet Balance',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/wallet/history',
                title: 'Transaction History',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
        ]
    },
    {
        path: '/security-settings',
        title: 'Settings',
        icon: 'ft-settings',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: []
    },
    {
        path: '/marketing-tools',
        title: 'Marketing Tools',
        icon: 'fa fa-cogs',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: []
    },

    {
        path: '/exchange',
        title: 'Exchange',
        icon: 'fa fa-exchange',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: []
    },
    {
        path: '/explorer',
        title: 'Explorer',
        icon: 'fa fa-search',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: []
    }

];
