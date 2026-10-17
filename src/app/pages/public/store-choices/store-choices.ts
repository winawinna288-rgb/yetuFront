import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { StoreChose } from '../../../components/Public/store-chose/store-chose';


@Component({
  selector: 'app-store-choices',
  imports: [CommonModule, HlmButtonImports, HlmSkeletonImports, StoreChose],
  styleUrl: './store-choices.css',
  templateUrl: './store-choices.html',
})
export class StoreChoices  {

}
