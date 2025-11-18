import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../../core/services/auth.service';

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
    MatBadgeModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  currentUser = this.authService.currentUser;
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  /**
   * Logout user
   */
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Navigation handled in service
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Force logout even if API call fails
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}

