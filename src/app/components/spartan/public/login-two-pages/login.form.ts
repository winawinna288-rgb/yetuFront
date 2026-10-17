import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAlertCircle, lucideGithub, lucideLoader2 } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { firstValueFrom } from 'rxjs';
import { AuthUsers } from '../../../../core/services/auth-User';
import { TenantContextService } from '../../../../core/services/tenant-context';

@Component({
	selector: 'spartan-two-column-login-form',
	imports: [FormRoot, FormField, RouterLink, HlmFieldImports, HlmInputImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideGithub, lucideLoader2, lucideAlertCircle })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formRoot]="form">
			<hlm-field-group>
				<div class="flex flex-col items-center gap-1 text-center">
					<h1 class="text-2xl font-bold">Connexion à votre compte</h1>
					<p class="text-muted-foreground text-sm text-balance">Entrez vos identifiants ci-dessous pour vous connecter</p>
				</div>

				@if (serverError()) {
					<div class="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive font-medium flex items-center gap-2">
						<ng-icon name="lucideAlertCircle" class="text-base shrink-0" />
						<span>{{ serverError() }}</span>
					</div>
				}

				<hlm-field>
					<label hlmFieldLabel for="email">Email</label>
					<input hlmInput type="email" id="email" placeholder="nom@exemple.com" [formField]="form.email" />
					@for (error of form.email().errors(); track error) {
						<hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
					}
				</hlm-field>

				<hlm-field>
					<div class="flex items-center">
						<label hlmFieldLabel for="password">Mot de passe</label>
						<a hlmFieldDescription class="ml-auto text-xs underline-offset-4 hover:underline" routerLink=".">
							Mot de passe oublié ?
						</a>
					</div>
					<input hlmInput type="password" id="password" placeholder="••••••••" [formField]="form.password" />
					@for (error of form.password().errors(); track error) {
						<hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
					}
				</hlm-field>

				<hlm-field>
					<button hlmBtn type="submit" [disabled]="form().submitting()" class="w-full cursor-pointer">
						@if (form().submitting()) {
							<ng-icon name="lucideLoader2" class="animate-spin mr-2 text-base" />
							<span>Connexion en cours...</span>
						} @else {
							<span>Se connecter</span>
						}
					</button>
				</hlm-field>

				<hlm-field-separator>Ou continuer avec</hlm-field-separator>

				<hlm-field>
					<button hlmBtn variant="outline" type="button" class="w-full cursor-pointer">
						<ng-icon name="lucideGithub" class="text-xl mr-2" />
						Connexion avec GitHub
					</button>
					<p hlmFieldDescription class="text-center text-xs mt-2">
						Vous n'avez pas encore de compte ?
						<a routerLink="/register" class="text-primary font-semibold underline underline-offset-4 hover:underline">
							S'inscrire
						</a>
					</p>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class LoginForm {
	private authService = inject(AuthUsers);
	private tenantContext = inject(TenantContextService);
	private router = inject(Router);

	protected readonly serverError = signal<string | null>(null);

	protected readonly _model = signal({
		email: '',
		password: '',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.email, { message: 'L’adresse email est requise.' });
			email(schemaPath.email, { message: 'Veuillez entrer une adresse email valide.' });
			required(schemaPath.password, { message: 'Le mot de passe est requis.' });
			minLength(schemaPath.password, 8, { message: 'Le mot de passe doit comporter au moins 8 caractères.' });
		},
		{
			submission: {
				action: async () => {
					this.serverError.set(null);
					try {
						const model = this._model();
						const response = await firstValueFrom(this.authService.login(model));

						// Si l'utilisateur possède déjà des boutiques
						if (response?.user?.tenants && response.user.tenants.length > 0) {
							if (response.user.tenants.length === 1) {
								this.tenantContext.setTenant(response.user.tenants[0]);
								this.router.navigate(['/StoreChoices']);
							} else {
								this.router.navigate(['/admin']);
							}
						} else {
							// Sinon, vers le stepper de création de boutique
							this.router.navigate(['/tenant-signup']);
						}
					} catch (error: any) {
						console.error('Erreur de connexion:', error);
						if (error?.status === 422 && error?.error) {
							if (error.error.errors) {
								const messages = Object.values(error.error.errors).flat().join(' ');
								this.serverError.set(messages || error.error.message);
							} else {
								this.serverError.set(error.error.message || 'Identifiants incorrects.');
							}
						} else {
							this.serverError.set(error?.error?.message || 'Une erreur est survenue lors de la connexion. Veuillez réessayer.');
						}
					}
				},
			},
		},
	);
}