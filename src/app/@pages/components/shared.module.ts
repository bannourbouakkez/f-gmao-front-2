import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObserversModule } from '@angular/cdk/observers';
import { HttpClientModule } from '@angular/common/http';

/*
import { NotificationComponent } from 'src/app/shared/header/notifications/notification/notification.component';
import { AutoComponent } from 'src/app/shared/header/auto/auto/auto.component';
import { MethodeStatComponent } from 'src/app/shared/header/ministat/methode-stat/methode-stat.component';
import { AdminStatComponent } from 'src/app/shared/header/ministat/admin-stat/admin-stat.component';
import { MagasinierStatComponent } from 'src/app/shared/header/ministat/magasinier-stat/magasinier-stat.component';
import { AchatStatComponent } from 'src/app/shared/header/ministat/achat-stat/achat-stat.component';
*/


import { SecondarySidebarComponent } from './secondary-sidebar/secondary-sidebar.component';

import { QuickviewService } from './quickview/quickview.service';
import { TypeaheadModule } from 'ngx-bootstrap';

import { ParallaxDirective } from './parallax/parallax.directive';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FormGroupDefaultDirective } from './forms/form-group-default.directive';
import { ViewDirective } from './view/view.directive';

import { pgCollapseModule } from './collapse/collapse.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ContainerComponent } from './container/container.component';
import { pageContainer } from './container/page-container.component';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { MenuAltComponent } from './menu/menu-alt.component';
import { MenuIconComponent } from './menu/menu-icon.component';

import { ListItemComponent } from './list-view/list-item/list-item.component';
import { ListViewContainerComponent } from './list-view/list-view-container/list-view-container.component';
import { pgRetinaDirective } from './retina/retina.directive';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [CommonModule, ObserversModule, TypeaheadModule.forRoot(), PerfectScrollbarModule, RouterModule],
  declarations: [
    SecondarySidebarComponent,
    ParallaxDirective,
    BreadcrumbComponent,
    FormGroupDefaultDirective,
    ViewDirective,
    ContainerComponent,
    pageContainer,
    MenuComponent,
    MenuAltComponent,
    MenuIconComponent,
    ListItemComponent,
    ListViewContainerComponent,
    pgRetinaDirective

    //,NotificationComponent
  ],
  exports: [
    SecondarySidebarComponent,
    ParallaxDirective,
    BreadcrumbComponent,
    FormGroupDefaultDirective,
    ViewDirective,
    pgCollapseModule,
    ContainerComponent,
    pageContainer,
    MenuComponent,
    MenuAltComponent,
    MenuIconComponent,
    ListItemComponent,
    ListViewContainerComponent,
    pgRetinaDirective

    //,NotificationComponent
  ],
  providers: [
    QuickviewService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class SharedModule {}
