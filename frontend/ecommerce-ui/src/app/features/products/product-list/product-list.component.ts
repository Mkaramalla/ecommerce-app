import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../shared/models/product.model';
import { HeaderComponent } from '../../layout/header/header.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    HeaderComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  isAdmin = signal(false);

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isAdmin.set(this.authService.isAdmin());
    this.loadProducts();
  }

  /**
   * Load all products from API
   */
  loadProducts(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.productService.getProducts().subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.data) {
          this.products.set(response.data as Product[]);
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set('Failed to load products. Please try again.');
        console.error('Error loading products:', error);
      }
    });
  }

  /**
   * Navigate to add product page
   */
  addProduct(): void {
    this.router.navigate(['/products/new']);
  }

  /**
   * Navigate to edit product page
   */
  editProduct(productId: number): void {
    this.router.navigate(['/products', productId, 'edit']);
  }

  /**
   * Delete product with confirmation
   */
  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Product deleted successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
            this.loadProducts(); // Reload the list
          }
        },
        error: (error) => {
          this.snackBar.open('Failed to delete product', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  /**
   * Get status chip color
   */
  getStatusColor(status: string): string {
    return status === 'active' ? 'primary' : 'warn';
  }

  /**
   * Format price for display
   */
  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}

