import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Customer,
  CreateCustomerRequest
} from '../../../core/models/customer.model';
import { AdminCustomersService } from '../../core/services/admin-customers';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.scss'
})
export class CustomersComponent implements OnInit {
  private readonly customersService = inject(AdminCustomersService);

  customers: Customer[] = [];

  searchTerm = '';
  isLoading = false;
  isSaving = false;
  showForm = false;
  errorMessage = '';
  successMessage = '';

  customerForm: CreateCustomerRequest = this.createEmptyForm();

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.errorMessage = '';


    const request = this.searchTerm.trim()
      ? this.customersService.search(this.searchTerm.trim())
      : this.customersService.getAll();

    request.subscribe({
      next: (customers) => {
        this.customers = customers;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load customers. Please try again.';
        this.isLoading = false;
      }
    });


  }

  onSearchChange(): void {
    this.loadCustomers();
  }

  openForm(): void {
    this.customerForm = this.createEmptyForm();
    this.successMessage = '';
    this.errorMessage = '';
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.customerForm = this.createEmptyForm();
  }

  createCustomer(): void {
    if (
      !this.customerForm.fullName.trim() ||
      !this.customerForm.phone.trim() ||
      !this.customerForm.nationality.trim() ||
      !this.customerForm.drivingLicenseNumber.trim()
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }


    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request: CreateCustomerRequest = {
      fullName: this.customerForm.fullName.trim(),
      phone: this.customerForm.phone.trim(),
      nationality: this.customerForm.nationality.trim(),
      drivingLicenseNumber: this.customerForm.drivingLicenseNumber.trim(),
      email: this.customerForm.email?.trim() || null
    };

    this.customersService.create(request).subscribe({
      next: () => {
        this.isSaving = false;
        this.showForm = false;
        this.customerForm = this.createEmptyForm();
        this.successMessage = 'Customer created successfully.';
        this.loadCustomers();
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage =
          error?.error?.message || 'Unable to create customer. Please try again.';
      }
    });


  }

  trackByCustomerId(_index: number, customer: Customer): number {
    return customer.id;
  }

  private createEmptyForm(): CreateCustomerRequest {
    return {
      fullName: '',
      phone: '',
      nationality: '',
      drivingLicenseNumber: '',
      email: null
    };
  }
}
