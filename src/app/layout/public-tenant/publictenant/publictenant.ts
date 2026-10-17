import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavabarTenant } from '../../../components/public-tenant/navabar-tenant/navabar-tenant';

@Component({
  imports: [RouterOutlet, NavabarTenant],
  selector: 'app-publictenant',
  styleUrl: './publictenant.css',
  templateUrl: './publictenant.html',
})
export class Publictenant {}
