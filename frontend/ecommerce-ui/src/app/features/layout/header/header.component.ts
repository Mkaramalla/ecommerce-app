import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  // Using inject() for Angular 19 best practice
  authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // Direct reference to the signal (no need for computed wrapper)
  currentUser = this.authService.currentUser;
  
  // Check if user is admin
  isAdmin = computed(() => {
    const user = this.currentUser();
    return user?.role === 'admin';
  });
  
  // Check if user is regular user
  isRegularUser = computed(() => {
    const user = this.currentUser();
    return user?.role === 'user';
  });
  
  // Track menu state
  menuOpen = signal(false);
  loggingOut = signal(false);
  
  /**
   * Handle menu opened event
   */
  onMenuOpened(): void {
    this.menuOpen.set(true);
  }
  
  /**
   * Handle menu closed event
   */
  onMenuClosed(): void {
    this.menuOpen.set(false);
  }

  /**
   * Logout user with confirmation and notifications
   */
  logout(event?: Event): void {
    console.log('Logout button clicked!', event);
    
    // Prevent event propagation and default behavior
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
    
    // Close menu first
    this.menuOpen.set(false);
    
    // Confirmation dialog
    const confirmed = confirm('Are you sure you want to logout?');
    console.log('User confirmed logout:', confirmed);
    
    if (confirmed) {
      this.loggingOut.set(true);
      console.log('Starting logout process...');
      
      // Call logout service
      this.authService.logout().subscribe({
        next: (response) => {
          console.log('Logout successful:', response);
          this.loggingOut.set(false);
          
          // Show success message
          this.snackBar.open('Logged out successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          
          // Clear auth data immediately
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          
          // Ensure navigation to login page
          setTimeout(() => {
            console.log('Navigating to login page...');
            this.router.navigate(['/login']).then(() => {
              console.log('Navigation complete, reloading page...');
              // Reload page to ensure clean state
              window.location.reload();
            }).catch(err => {
              console.error('Navigation error:', err);
              window.location.href = '/login';
            });
          }, 500);
        },
        error: (error) => {
          console.error('Logout error:', error);
          this.loggingOut.set(false);
          
          // Show warning message
          this.snackBar.open('Logged out locally', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          
          // Clear auth data immediately
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          
          // Ensure navigation to login page even on error
          setTimeout(() => {
            console.log('Navigating to login page after error...');
            this.router.navigate(['/login']).then(() => {
              console.log('Navigation complete, reloading page...');
              // Reload page to ensure clean state
              window.location.reload();
            }).catch(err => {
              console.error('Navigation error:', err);
              window.location.href = '/login';
            });
          }, 500);
        }
      });
    } else {
      console.log('User cancelled logout');
    }
  }
}

