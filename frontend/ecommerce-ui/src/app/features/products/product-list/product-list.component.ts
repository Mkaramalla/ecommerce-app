import { Component, OnInit, signal, inject } from '@angular/core';
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

  // Using inject() for Angular 19 best practice
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

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
          const productsData = response.data as Product[];
          // Ensure price is a number (convert from string if needed)
          const normalizedProducts = productsData.map(product => ({
            ...product,
            price: typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0)
          }));
          // Debug: Log products to verify data
          console.log('Products loaded:', normalizedProducts);
          normalizedProducts.forEach((product, index) => {
            console.log(`Product ${index + 1}:`, {
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              priceType: typeof product.price,
              hasName: !!product.name,
              hasDescription: !!product.description
            });
          });
          this.products.set(normalizedProducts);
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
   * Navigate to view product details page
   */
  viewProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
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
  isValidImageUrl(url: string): boolean {
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
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Hide broken image and show placeholder
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent && !parent.querySelector('.no-image')) {
      const noImageDiv = document.createElement('div');
      noImageDiv.className = 'no-image';
      noImageDiv.innerHTML = `
        <mat-icon>image</mat-icon>
        <span>Image not available</span>
      `;
      parent.appendChild(noImageDiv);
    }
  }

}

