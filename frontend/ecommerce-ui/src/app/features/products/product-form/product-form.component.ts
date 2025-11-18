import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../shared/models/product.model';
import { HeaderComponent } from '../../layout/header/header.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule,
    HeaderComponent
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  loading = signal(false);
  isEditMode = signal(false);
  productId: number | null = null;
  
  statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      image: ['', [Validators.maxLength(500)]],
      price: ['', [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      status: ['active', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId = parseInt(id, 10);
      this.isEditMode.set(true);
      this.loadProduct();
    }
  }

  /**
   * Load product data for editing
   */
  loadProduct(): void {
    if (!this.productId) return;

    this.loading.set(true);
    this.productService.getProduct(this.productId).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.data) {
          const product = response.data as Product;
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            image: product.image || '',
            price: product.price,
            status: product.status
          });
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.snackBar.open('Failed to load product', 'Close', {
          duration: 3000
        });
        console.error('Error loading product:', error);
        this.router.navigate(['/products']);
      }
    });
  }

  /**
   * Get form field error message
   */
  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    
    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} cannot exceed ${maxLength} characters`;
    }
    
    if (field?.hasError('min')) {
      return `${this.getFieldLabel(fieldName)} must be greater than or equal to 0`;
    }
    
    if (field?.hasError('pattern')) {
      return `${this.getFieldLabel(fieldName)} must be a valid number with up to 2 decimal places`;
    }
    
    return '';
  }

  /**
   * Get field label for error messages
   */
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Product name',
      description: 'Description',
      image: 'Image URL',
      price: 'Price',
      status: 'Status'
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Submit form (create or update)
   */
  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const productData = this.productForm.value;

    // Convert price to number
    productData.price = parseFloat(productData.price);

    const request = this.isEditMode() && this.productId
      ? this.productService.updateProduct(this.productId, productData)
      : this.productService.createProduct(productData);

    request.subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success) {
          const message = this.isEditMode() 
            ? 'Product updated successfully'
            : 'Product created successfully';
          
          this.snackBar.open(message, 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          
          this.router.navigate(['/products']);
        }
      },
      error: (error) => {
        this.loading.set(false);
        
        let errorMessage = 'An error occurred. Please try again.';
        
        if (error.status === 422 && error.error?.errors) {
          // Display validation errors
          const errors = error.error.errors;
          const firstError = Object.values(errors)[0] as string[];
          errorMessage = firstError[0];
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        
        console.error('Error saving product:', error);
      }
    });
  }

  /**
   * Cancel and go back to products list
   */
  cancel(): void {
    this.router.navigate(['/products']);
  }
}

