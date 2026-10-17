import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Navbar} from '../../../components/Public/navbar/navbar'


@Component({
  imports: [RouterOutlet,Navbar],
  selector: 'app-public',
  styleUrl: './public.css',
  templateUrl: './public.html',
})
export class Public {}
