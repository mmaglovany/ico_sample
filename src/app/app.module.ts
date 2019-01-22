import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {BsDropdownModule, ModalModule, TooltipModule} from 'ngx-bootstrap';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';

import {AuthenticationService} from './sevises/authentication.service';
import {AuthConfig, AuthHttp} from 'angular2-jwt';
import {Http, HttpModule, RequestOptions} from '@angular/http';
import {routing} from './app.routing';
import {RecaptchaModule} from 'ng-recaptcha';
import {EmailConfirmationComponent} from './components/email-confirmation/email-confirmation.component';
import {FullLayoutComponent} from "./layouts/full/full-layout.component";
import {SharedModule} from "./shared/shared.module";

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';

import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {NgxPhoneSelectModule} from 'ngx-phone-select';
import {ReferralsComponent} from './components/referrals/referrals.component';
import {SecuritySettingsComponent} from './components/security-settings/security-settings.component';
import {ResetPasswordComponent} from './components/login/reset-password/reset-password.component';
import {ReferralsTreeComponent} from './components/referrals/referrals-tree/referrals-tree.component';
import {ReferralsMembersComponent} from "./components/referrals/referrals-members/referrals-members.component";
import {ReferralTreeComponent} from "./components/referrals/referrals-tree/referral-tree/referral-tree.component";
import {TreeviewModule} from 'ngx-treeview';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {
    DepositsWithdrawalsComponent,
    WalletModalContent, WithdrawWalletModalContent
} from './components/wallet/deposits-withdrawals/deposits-withdrawals.component';
import {HistoryComponent} from "./components/wallet/history/history.component";
import {NgbdModalContent, TopBarComponent} from "./shared/top-bar/top-bar.component";
import {ClipboardModule} from "ngx-clipboard/dist";
import {ExchangeComponent} from "./components/exchange/exchange.component";
import {ExplorerComponent} from "./components/explorer/explorer.component";
import {MarketingToolsComponent} from "./components/marketing-tools/marketing-tools.component";
import {AdminLayoutComponent} from "./layouts/admin/admin-layout.component";
import {AdminHomeComponent} from "./components/admin/home/admin-home.component";
import {AdminLoginComponent} from "./components/admin/login/admin-login.component";
import {IcoSettingsComponent} from "./components/admin/ico-settings/ico-settings.component";
import {UserListComponent} from "./components/admin/user-list/user-list.component";
import {AdminGuard} from "./guards/admin.guard";
import {AuthGuard} from "./guards/auth.guard";
import {IcoModalContent, IcoPageComponent} from "./components/ico-page/ico-page.component";
import {WalletService} from "./sevises/wallet.service";
import {ResendEmailComponent} from "./components/login/resend-email/resend-email.component";
import {AdminTransactionHistoryComponent} from "./components/admin/admin-transaction-history/admin-transaction-history.component";
import {RecaptchaFormsModule} from 'ng-recaptcha/forms';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig({
        headerPrefix: 'Bearer',
        tokenGetter: (() => JSON.parse(localStorage.getItem('currentUser')).token)
    }), http, options);
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        EmailConfirmationComponent,
        FullLayoutComponent,
        AdminLayoutComponent,
        AdminHomeComponent,
        AdminLoginComponent,
        ReferralsTreeComponent,
        ReferralsTreeComponent,
        SecuritySettingsComponent,
        ResetPasswordComponent,
        ReferralsMembersComponent,
        ReferralTreeComponent,
        ReferralsComponent,
        DepositsWithdrawalsComponent,
        HistoryComponent,
        TopBarComponent,
        NgbdModalContent,
        WalletModalContent,
        ExchangeComponent,
        ExplorerComponent,
        MarketingToolsComponent,
        IcoSettingsComponent,
        UserListComponent,
        IcoPageComponent,
        ResendEmailComponent,
        IcoModalContent,
        AdminTransactionHistoryComponent,
        WithdrawWalletModalContent
    ],
    imports: [
        NgbModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        RecaptchaFormsModule,
        HttpClientModule,
        BsDropdownModule,
        TooltipModule,
        ModalModule,
        HttpModule,
        routing,
        NgxPhoneSelectModule,
        SharedModule,
        NgxDatatableModule,
        ClipboardModule,
        NgbModule.forRoot(),
        RecaptchaModule.forRoot(),
        TreeviewModule.forRoot()
    ],
    providers: [
        AdminGuard,
        AuthGuard,
        AuthenticationService,
        WalletService,
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions]
        }
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        NgbdModalContent,
        WalletModalContent,
        IcoModalContent,
        WithdrawWalletModalContent
    ]
})
export class AppModule {
}
