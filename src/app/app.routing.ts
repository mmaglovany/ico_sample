import {RouterModule, Routes} from "@angular/router";
import {FullLayoutComponent} from "./layouts/full/full-layout.component";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {EmailConfirmationComponent} from "./components/email-confirmation/email-confirmation.component";
import {HomeComponent} from "./components/home/home.component";
import {SecuritySettingsComponent} from "./components/security-settings/security-settings.component";
import {ResetPasswordComponent} from "./components/login/reset-password/reset-password.component";
import {ReferralsTreeComponent} from "./components/referrals/referrals-tree/referrals-tree.component";
import {ReferralsMembersComponent} from "./components/referrals/referrals-members/referrals-members.component";
import {DepositsWithdrawalsComponent} from "./components/wallet/deposits-withdrawals/deposits-withdrawals.component";
import {HistoryComponent} from "./components/wallet/history/history.component";
import {ExchangeComponent} from "./components/exchange/exchange.component";
import {ExplorerComponent} from "./components/explorer/explorer.component";
import {MarketingToolsComponent} from "./components/marketing-tools/marketing-tools.component";
import {AdminLayoutComponent} from "./layouts/admin/admin-layout.component";
import {AdminHomeComponent} from "./components/admin/home/admin-home.component";
import {AdminLoginComponent} from "./components/admin/login/admin-login.component";
import {UserListComponent} from "./components/admin/user-list/user-list.component";
import {IcoSettingsComponent} from "./components/admin/ico-settings/ico-settings.component";
import {AuthGuard} from "./guards/auth.guard";
import {AdminGuard} from "./guards/admin.guard";
import {IcoPageComponent} from "./components/ico-page/ico-page.component";
import {ResendEmailComponent} from "./components/login/resend-email/resend-email.component";
import {AdminTransactionHistoryComponent} from "./components/admin/admin-transaction-history/admin-transaction-history.component";

const appRoutes: Routes = [
    {
        path: '',
        component: FullLayoutComponent,
        data: {title: 'full Views'},
        children: [
            {
                path: '',
                component: HomeComponent,
                canActivate: [AuthGuard],
                pathMatch: 'full',
            },
            {
                path: 'exchange',
                component: ExchangeComponent,
                canActivate: [AuthGuard],
                pathMatch: 'full',
            },
            {
                path: 'ico',
                component: IcoPageComponent,
                canActivate: [AuthGuard],
                pathMatch: 'full',
            },
            {
                path: 'explorer',
                component: ExplorerComponent,
                canActivate: [AuthGuard],
                pathMatch: 'full',
            },
            {
                path: 'marketing-tools',
                component: MarketingToolsComponent,
                canActivate: [AuthGuard],
                pathMatch: 'full',
            },
            {
                path: 'login',
                children: [
                    {
                        path: '',
                        component: LoginComponent,
                        pathMatch: 'full'
                    },
                    {
                        path: 'reset-password',
                        component: ResetPasswordComponent,
                        pathMatch: 'full'
                    },
                    {
                        path: 'resend-email',
                        component: ResendEmailComponent,
                        pathMatch: 'full'
                    },
                    {
                        path: 'reset-password/:email/:reset_pass_token',
                        component: ResetPasswordComponent,
                        pathMatch: 'full'
                    }
                ]
            },
            {
                path: 'register',
                children: [
                    {
                        path: '',
                        component: RegisterComponent,
                        pathMatch: 'full'
                    },
                    {
                        path: 'referral/:referral',
                        component: RegisterComponent,
                        pathMatch: 'full'
                    },
                    {
                        path: 'email-confirmation',
                        component: EmailConfirmationComponent,
                        pathMatch: 'full'
                    },
                    {
                        path: 'email-confirmation/:status',
                        component: EmailConfirmationComponent,
                        pathMatch: 'full'
                    },
                    {
                        path: ':activation',
                        component: RegisterComponent,
                        pathMatch: 'full'
                    },

                ]
            },
            {
                path: 'referrals',
                canActivate: [AuthGuard],
                children: [
                    {
                        path: 'members',
                        component: ReferralsMembersComponent,
                        pathMatch: 'full'
                    },
                    {
                        path: 'network-tree',
                        component: ReferralsTreeComponent,
                        pathMatch: 'full'
                    }
                ]
            },
            {
                path: 'security-settings',
                component: SecuritySettingsComponent,
                canActivate: [AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'wallet',
                canActivate: [AuthGuard],
                children: [
                    {
                        path: 'deposits',
                        component: DepositsWithdrawalsComponent,
                        pathMatch: 'full'
                    },
                    {
                        path: 'history',
                        component: HistoryComponent,
                        pathMatch: 'full'
                    }
                ]
            }
        ]
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [AdminGuard],
        data: {title: 'full Views'},
        children: [
            {
                path: '',
                component: AdminHomeComponent,
                canActivate: [AdminGuard],
                pathMatch: 'full',
            },
            {
                path: 'user-list',
                component: UserListComponent,
                canActivate: [AdminGuard],
                pathMatch: 'full',
            },
            {
                path: 'ico-history',
                component: AdminTransactionHistoryComponent,
                canActivate: [AdminGuard],
                pathMatch: 'full',
            },
            {
                path: 'ico-settings',
                component: IcoSettingsComponent,
                canActivate: [AdminGuard],
                pathMatch: 'full',
            },
            {
                path: 'admin-settings',
                component: SecuritySettingsComponent,
                canActivate: [AdminGuard],
                pathMatch: 'full'
            },
        ]
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        data: {title: 'full Views'},
        children: [
            {
                path: 'login',
                children: [
                    {
                        path: '',
                        component: AdminLoginComponent,
                        pathMatch: 'full'
                    }
                ]
            }
        ]
    }

];

export const routing = RouterModule.forRoot(appRoutes);
