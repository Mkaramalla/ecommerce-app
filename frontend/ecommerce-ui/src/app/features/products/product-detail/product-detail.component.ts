import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../shared/models/product.model';
import { HeaderComponent } from '../../layout/header/header.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule,
    HeaderComponent
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  isAdmin = signal(false);
  imageError = signal(false);

  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.isAdmin.set(this.authService.isAdmin());
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(parseInt(id, 10));
    } else {
      this.errorMessage.set('Product ID is required');
      this.loading.set(false);
    }
  }

  /**
   * Load product details
   */
  loadProduct(id: number): void {
    this.loading.set(true);
    this.errorMessage.set(null);

          this.productService.getProduct(id).subscribe({
            next: (response) => {
              this.loading.set(false);
              if (response.success && response.data) {
                const productData = response.data as Product;
                // Ensure price is a number (convert from string if needed)
                const normalizedProduct = {
                  ...productData,
                  price: typeof productData.price === 'string' ? parseFloat(productData.price) : (productData.price || 0)
                };
                this.product.set(normalizedProduct);
              } else {
                this.errorMessage.set('Product not found');
              }
            },
      error: (error) => {
        this.loading.set(false);
        if (error.status === 404) {
          this.errorMessage.set('Product not found');
        } else {
          this.errorMessage.set('Failed to load product. Please try again.');
        }
        console.error('Error loading product:', error);
      }
    });
  }

  /**
   * Navigate to edit product page
   */
  editProduct(): void {
    const product = this.product();
    if (product) {
      this.router.navigate(['/products', product.id, 'edit']);
    }
  }

  /**
   * Delete product with confirmation
   */
  deleteProduct(): void {
    const product = this.product();
    if (!product) return;

    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Product deleted successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
            this.router.navigate(['/products']);
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
   * Format price for display
   */
  formatPrice(price: number | string | null | undefined): string {
    // Convert to number if it's a string
    const numPrice = typeof price === 'string' ? parseFloat(price) : (price || 0);
    
    // Check if it's a valid number
    if (isNaN(numPrice) || !isFinite(numPrice)) {
      return '$0.00';
    }
    
    return `$${numPrice.toFixed(2)}`;
  }

  /**
   * Check if image URL is valid
   */
  isValidImageUrl(url: string | null): boolean {
    if (!url || url.trim() === '') return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Handle image loading errors
   */
  onImageError(): void {
    this.imageError.set(true);
  }

  /**
   * Go back to products list
   */
  goBack(): void {
    this.router.navigate(['/products']);
  }
}

