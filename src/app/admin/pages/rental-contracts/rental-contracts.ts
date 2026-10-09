
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import {
  RentalContract,
  RentalContractStatus,
  RentalPlan
} from '../../../core/models/rental-contract.model';

import { AdminRentalContractsService } from '../../core/services/admin-rental-contracts';

@Component({
  selector: 'app-rental-contracts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rental-contracts.html',
  styleUrl: './rental-contracts.scss'
})
export class RentalContractsComponent implements OnInit {
  private readonly contractsService = inject(AdminRentalContractsService);

  contracts: RentalContract[] = [];
  isLoading = false;
  errorMessage = '';

  readonly RentalPlan = RentalPlan;
  readonly RentalContractStatus = RentalContractStatus;

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.contractsService.getAll().subscribe({
      next: (contracts) => {
        this.contracts = contracts;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load rental contracts:', error);
        this.errorMessage =
          'Unable to load rental contracts. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getPlanLabel(plan: RentalPlan): string {
    switch (plan) {
      case RentalPlan.Daily:
        return 'Daily';
      case RentalPlan.Weekly:
        return 'Weekly';
      case RentalPlan.Monthly:
        return 'Monthly';
      default:
        return 'Unknown';
    }
  }

  getStatusLabel(status: RentalContractStatus): string {
    switch (status) {
      case RentalContractStatus.Active:
        return 'Active';
      case RentalContractStatus.Completed:
        return 'Completed';
      case RentalContractStatus.Cancelled:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  trackByContractId(_index: number, contract: RentalContract): string {
    return contract.id;
  }

  getTotalRevenue(): number {
    return this.contracts.reduce(
      (total, contract) => total + contract.grandTotal,
      0
    );
  }

  getTotalProfit(): number {
    return this.contracts.reduce(
      (total, contract) => total + contract.netProfit,
      0
    );
  }
}