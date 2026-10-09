
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Supplier,
  CreateSupplierRequest
} from '../../../core/models/supplier.model';

import { AdminSuppliersService } from '../../core/services/admin-suppliers';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.scss'
})
export class SuppliersComponent implements OnInit {
  private readonly suppliersService = inject(AdminSuppliersService);

  suppliers: Supplier[] = [];

  searchTerm = '';
  isLoading = false;
  isSaving = false;
  showForm = false;
  errorMessage = '';
  successMessage = '';

  supplierForm: CreateSupplierRequest = this.createEmptyForm();

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.suppliersService.getAll().subscribe({
      next: (suppliers) => {
        const term = this.searchTerm.trim().toLowerCase();

        this.suppliers = term
          ? suppliers.filter(supplier =>
              [
                supplier.name,
                supplier.phone,
                supplier.email
              ].some(value => value?.toLowerCase().includes(term))
            )
          : suppliers;

        this.isLoading = false;
      },
      error: () => {
        this.errorMessage =
          'Unable to load suppliers. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSearchChange(): void {
    this.loadSuppliers();
  }

  openForm(): void {
    this.supplierForm = this.createEmptyForm();
    this.errorMessage = '';
    this.successMessage = '';
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.supplierForm = this.createEmptyForm();
  }

  createSupplier(): void {
    if (
      !this.supplierForm.name.trim() ||
      !this.supplierForm.phone.trim()
    ) {
      this.errorMessage =
        'Please fill in the supplier name and phone.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request: CreateSupplierRequest = {
      name: this.supplierForm.name.trim(),
      phone: this.supplierForm.phone.trim(),
      email: this.supplierForm.email?.trim() || null,
      notes: this.supplierForm.notes?.trim() || null
    };

    this.suppliersService.create(request).subscribe({
      next: () => {
        this.isSaving = false;
        this.showForm = false;
        this.supplierForm = this.createEmptyForm();
        this.successMessage = 'Supplier created successfully.';
        this.loadSuppliers();
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage =
          error?.error?.message ||
          'Unable to create supplier. Please try again.';
      }
    });
  }

  trackBySupplierId(_index: number, supplier: Supplier): number {
    return supplier.id;
  }

  private createEmptyForm(): CreateSupplierRequest {
    return {
      name: '',
      phone: '',
      email: null,
        notes: null
    };
  }
}