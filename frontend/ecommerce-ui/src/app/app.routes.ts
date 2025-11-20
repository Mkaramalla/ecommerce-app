import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductFormComponent } from './features/products/product-form/product-form.component';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';

export const routes: Routes = [
  // Default redirect to login
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  // Login route (public)
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login - E-Commerce'
  },

  // Products list (protected - all authenticated users)
  {
    path: 'products',
    component: ProductListComponent,
    canActivate: [authGuard],
    title: 'Products - E-Commerce'
  },

  // Create new product (protected - admin only) - MUST come before products/:id
  {
    path: 'products/new',
    component: ProductFormComponent,
    canActivate: [authGuard, adminGuard],
    title: 'Add Product - E-Commerce'
  },

  // Edit existing product (protected - admin only) - MUST come before products/:id
  {
    path: 'products/:id/edit',
    component: ProductFormComponent,
    canActivate: [authGuard, adminGuard],
    title: 'Edit Product - E-Commerce'
  },

  // Product detail (protected - all authenticated users) - MUST come last
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    canActivate: [authGuard],
    title: 'Product Details - E-Commerce'
  },

  // Wildcard route - redirect to login
  {
    path: '**',
    redirectTo: '/login'
  }
];
