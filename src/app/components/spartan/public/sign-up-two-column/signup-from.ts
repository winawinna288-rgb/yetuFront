import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { email, form, FormField, FormRoot, minLength, required, validate } from '@angular/forms/signals';
import { User } from '../../../../core/models/user';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGithub } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { AuthUsers } from '../../../../core/services/auth-User';
import { firstValueFrom } from 'rxjs';

@Component({
	selector: 'spartan-two-column-signup-form',
	imports: [FormRoot, FormField, RouterLink, HlmFieldImports, HlmInputImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideGithub })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formRoot]="form">
			<hlm-field-group>
				<div class="flex flex-col items-center gap-1 text-center">
					<h1 class="text-2xl font-bold">Create your account</h1>
					<p class="text-muted-foreground text-sm text-balance">Fill in the form below to create your account</p>
				</div>
				@if (serverError()) {
					<div class="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive font-medium">
						{{ serverError() }}
					</div>
				}
				<hlm-field>
					<label hlmFieldLabel for="first_name">Prenom</label>
					<input hlmInput type="text" id="first_name" placeholder="John" [formField]="form.first_name" />
					@for (error of form.first_name().errors(); track error) {
						<hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
					}
				</hlm-field>
                <hlm-field>
					<label hlmFieldLabel for="last_name">Nom</label>
					<input hlmInput type="text" id="last_name" placeholder="Doe" [formField]="form.last_name" />
					@for (error of form.last_name().errors(); track error) {
						<hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
					}
				</hlm-field>
				<hlm-field>
					<label hlmFieldLabel for="email">Email</label>
					<input hlmInput type="email" id="email" placeholder="you@example.com" [formField]="form.email" />
					@if (!(form.email().touched() && form.email().invalid())) {
					}
					@for (error of form.email().errors(); track error) {
						<hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
					}
				</hlm-field>
				<hlm-field>
					<label hlmFieldLabel for="password">Password</label>
					<input hlmInput type="password" id="password" [formField]="form.password" />
					@if (!(form.password().touched() && form.password().invalid())) {
						<hlm-field-description>Must be at least 8 characters long.</hlm-field-description>
					}
					@for (error of form.password().errors(); track error) {
						<hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
					}
				</hlm-field>
				<hlm-field>
					<label hlmFieldLabel for="confirmPassword">Confirm Password</label>
					<input hlmInput type="password" id="confirmPassword" [formField]="form.confirmPassword" />
					@if (!(form.confirmPassword().touched() && form.confirmPassword().invalid())) {
						<hlm-field-description>Please confirm your password.</hlm-field-description>
					}
					@if (form.confirmPassword().touched() && form.confirmPassword().invalid()) {
						@for (error of form.confirmPassword().errors(); track error) {
							<hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
						}
					}
				</hlm-field>
				<hlm-field>
					<button hlmBtn type="submit" [disabled]="form().submitting()">Create Account</button>
				</hlm-field>
				<hlm-field-separator>Or continue with</hlm-field-separator>
				<hlm-field>
					<button hlmBtn variant="outline" type="button">
						<ng-icon name="lucideGithub" class="text-xl" />
						Login with GitHub
					</button>
					<p hlmFieldDescription class="text-center">
						Already have an account?
						<a routerLink=".">Sign in</a>
					</p>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class SignupForm {
	userservice = inject(AuthUsers);
	router = inject(Router);

	protected readonly serverError = signal<string | null>(null);

	protected readonly usermodel = signal<User>({
		first_name: '',
		last_name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	public readonly form = form(
		this.usermodel,
		(schemaPath) => {
			required(schemaPath.first_name, { message: 'Name is required.' });
			required(schemaPath.last_name, { message: 'Last name is required.' });
			email(schemaPath.email, { message: 'Enter a valid email address.' });
			required(schemaPath.password, { message: 'Password is required.' });
			minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters long.' });
			required(schemaPath.confirmPassword, { message: 'Confirming your password is required.' });

			validate(schemaPath.confirmPassword, ({ value, valueOf, stateOf }) => {
				if (value() === '') return null;
				if (!stateOf(schemaPath.password).touched()) return null;
				if (value() !== valueOf(schemaPath.password)) {
					return {
						kind: 'passwordMismatch',
						message: 'Passwords must match.',
					};
				}
				return null;
			});
		},
		{
			submission: {
				action: async () => {
					this.serverError.set(null);
					try {
						const model = this.usermodel();
						await firstValueFrom(this.userservice.createUser(model));
						this.router.navigate(['/tenant-signup']);
					} catch (error: any) {
						console.error('Registration error:', error);
						if (error?.status === 422 && error?.error) {
							if (error.error.errors) {
								const messages = Object.values(error.error.errors).flat().join(' ');
								this.serverError.set(messages || error.error.message);
							} else {
								this.serverError.set(error.error.message || 'Validation error.');
							}
						} else {
							this.serverError.set(error?.error?.message || 'An error occurred during registration. Please try again.');
						}
					}
				},
			},
		},
	);
}