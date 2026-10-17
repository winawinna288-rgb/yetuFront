import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	OnInit,
	signal,
	ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideArrowLeft,
	lucideArrowRight,
	lucideCheck,
	lucideCheckCircle2,
	lucideSparkles,
	lucideStore,
	lucideShieldCheck,
	lucideRefreshCw,
	lucideGlobe,
	lucideAlertCircle,
	lucideLoader2,
	lucideMail,
	lucidePhone,
	lucideCoins,
	lucideLanguages,
	lucideExternalLink,
} from '@ng-icons/lucide';
import { SpartanStepperImports } from '../../stepper-lib.ts/lib';
import { TenantService } from '../../../../core/services/tenants';
import { AuthUsers } from '../../../../core/services/auth-User';
import { Plan } from '../../../../core/models/plan';

export interface CreatedShopSuccess {
	message: string;
	payment_required: boolean;
	tenant?: {
		id: string;
		raison_sociale: string;
		slug: string;
		url: string;
		admin_url: string;
		logo_url?: string;
	};
	tenant_slug?: string;
}

@Component({
	selector: 'spartan-stepper-basic',
	imports: [
		CommonModule,
		FormsModule,
		SpartanStepperImports,
		HlmButtonImports,
		HlmSkeletonImports,
		HlmInputImports,
		HlmFieldImports,
		HlmTextareaImports,
		NgIcon,
	],
	providers: [
		provideIcons({
			lucideArrowLeft,
			lucideArrowRight,
			lucideCheck,
			lucideCheckCircle2,
			lucideSparkles,
			lucideStore,
			lucideShieldCheck,
			lucideRefreshCw,
			lucideGlobe,
			lucideAlertCircle,
			lucideLoader2,
			lucideMail,
			lucidePhone,
			lucideCoins,
			lucideLanguages,
			lucideExternalLink,
		}),
	],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block w-full',
	},
	template: `
		<div class="flex min-h-svh w-full justify-center p-4 sm:p-6 md:p-10 bg-background text-foreground">
			<div class="w-full max-w-6xl">

				<!-- VUE DE SUCCÈS (APRÈS CRÉATION DE LA BOUTIQUE) -->
				@if (createdShop()) {
					<div class="max-w-2xl mx-auto py-10 px-6 sm:px-8 bg-card border border-border/60 rounded-3xl text-center space-y-6 shadow-lg animate-in fade-in zoom-in-95 duration-300">
						<div class="size-20 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
							<ng-icon name="lucideCheckCircle2" class="text-4xl" />
						</div>

						<div class="space-y-2">
							<h2 class="text-3xl font-extrabold tracking-tight">Félicitations ! 🎉</h2>
							<p class="text-muted-foreground text-sm sm:text-base">
								Votre boutique <strong class="text-foreground">{{ shopName() }}</strong> a été configurée avec succès sur la plateforme Yetufy.
							</p>
						</div>

						<!-- Carte d'informations du domaine -->
						<div class="p-4 rounded-xl bg-muted/40 border border-border/60 text-left space-y-2">
							<div class="flex items-center justify-between">
								<span class="text-xs text-muted-foreground font-medium uppercase tracking-wider">Adresse publique :</span>
								<span class="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
									<ng-icon name="lucideCheck" class="text-xs" /> En ligne
								</span>
							</div>
							<div class="flex items-center justify-between gap-2">
								<a
									[href]="createdShop()?.tenant?.url || ('http://' + shopSlug() + '.yetufy.com')"
									target="_blank"
									class="text-sm sm:text-base font-semibold text-primary hover:underline flex items-center gap-1.5"
								>
									<span>https://{{ shopSlug() }}.yetufy.com</span>
									<ng-icon name="lucideExternalLink" class="text-sm shrink-0" />
								</a>
							</div>
						</div>

						<!-- Actions -->
						<div class="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
							@if (createdShop()?.tenant?.admin_url) {
								<a
									[href]="createdShop()?.tenant?.admin_url"
									class="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors shadow-xs"
								>
									<span>Accéder à l'espace vendeur</span>
									<ng-icon name="lucideArrowRight" class="ml-2 text-sm" />
								</a>
							} @else {
								<button
									hlmBtn
									(click)="goToDashboard()"
									class="px-6 cursor-pointer"
								>
									<span>Accéder au tableau de bord</span>
									<ng-icon name="lucideArrowRight" class="ml-2 text-sm" />
								</button>
							}

							<button
								hlmBtn
								variant="outline"
								(click)="resetStepper()"
								class="cursor-pointer"
							>
								Créer une autre boutique
							</button>
						</div>
					</div>
				} @else {

				<!-- FORMULAIRE STEPPER EN 4 ÉTAPES -->
				<spartan-stepper>

					<!-- ============================================== -->
					<!-- ÉTAPE 1 : CHOIX DU PLAN                        -->
					<!-- ============================================== -->
					<spartan-step label="Formule">
						<div class="flex flex-col gap-8 py-2">
							<!-- En-tête de l'étape -->
							<div class="text-center max-w-2xl mx-auto space-y-2">
								<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-1">
									<ng-icon name="lucideSparkles" class="text-sm" />
									<span>Étape 1 sur 4</span>
								</div>
								<h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
									Choisissez votre Plan
								</h2>
								<p class="text-muted-foreground text-sm sm:text-base">
									Sélectionnez le forfait adapté à la taille de votre activité. Vous pourrez modifier votre plan à tout moment depuis votre tableau de bord.
								</p>
							</div>

							<!-- Chargement des plans (Skeletons) -->
							@if (isLoadingPlans()) {
								<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									@for (i of [1, 2, 3]; track i) {
										<div class="rounded-2xl border border-border/60 p-6 flex flex-col gap-4 bg-card shadow-xs">
											<div class="flex justify-between items-start">
												<div hlmSkeleton class="h-6 w-24"></div>
												<div hlmSkeleton class="h-5 w-16 rounded-full"></div>
											</div>
											<div hlmSkeleton class="h-4 w-3/4"></div>
											<div hlmSkeleton class="h-10 w-32 my-2"></div>
											<div class="space-y-2.5 pt-4 border-t border-border/40">
												<div hlmSkeleton class="h-4 w-full"></div>
												<div hlmSkeleton class="h-4 w-5/6"></div>
												<div hlmSkeleton class="h-4 w-4/6"></div>
											</div>
											<div hlmSkeleton class="h-10 w-full mt-auto rounded-lg"></div>
										</div>
									}
								</div>
							}

							<!-- Erreur lors du chargement -->
							@if (loadError() && !isLoadingPlans()) {
								<div class="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-center space-y-3 max-w-md mx-auto">
									<p class="text-sm text-destructive font-medium">{{ loadError() }}</p>
									<button hlmBtn variant="outline" size="sm" (click)="loadPlans()">
										<ng-icon name="lucideRefreshCw" class="mr-1.5 text-xs" />
										Réessayer
									</button>
								</div>
							}

							<!-- Grille des plans disponibles -->
							@if (!isLoadingPlans() && plans().length > 0) {
								<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
									@for (plan of plans(); track plan.id) {
										<div
											(click)="selectPlan(plan.id)"
											[class.border-primary]="selectedPlanId() === plan.id"
											[class.ring-2]="selectedPlanId() === plan.id"
											[class.ring-primary]="selectedPlanId() === plan.id"
											[class.bg-primary/[0.02]]="selectedPlanId() === plan.id"
											[class.shadow-md]="selectedPlanId() === plan.id || plan.is_recommended"
											[class.border-border/60]="selectedPlanId() !== plan.id"
											class="relative rounded-2xl border bg-card p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer hover:border-primary/60 hover:shadow-sm"
										>
											<!-- Badge Recommandé / Populaire -->
											@if (plan.is_recommended || plan.badge) {
												<div class="absolute -top-3 left-1/2 -translate-x-1/2">
													<span class="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground shadow-xs">
														<ng-icon name="lucideSparkles" class="text-xs" />
														{{ plan.badge || 'Populaire' }}
													</span>
												</div>
											}

											<div>
												<!-- Titre et indicateur de sélection -->
												<div class="flex items-start justify-between gap-2 mb-2">
													<div>
														<h3 class="text-xl font-bold tracking-tight text-foreground">
															{{ plan.name }}
														</h3>
														<p class="text-muted-foreground text-xs line-clamp-2 mt-1">
															{{ plan.description }}
														</p>
													</div>

													<div
														[class.bg-primary]="selectedPlanId() === plan.id"
														[class.border-primary]="selectedPlanId() === plan.id"
														[class.border-muted-foreground/30]="selectedPlanId() !== plan.id"
														class="size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
													>
														@if (selectedPlanId() === plan.id) {
															<div class="size-2 rounded-full bg-primary-foreground"></div>
														}
													</div>
												</div>

												<!-- Prix -->
												<div class="py-4 border-b border-border/40">
													<div class="flex items-baseline gap-1">
														@if (plan.price === 0) {
															<span class="text-3xl font-extrabold text-foreground">Gratuit</span>
														} @else {
															<span class="text-3xl font-extrabold text-foreground">{{ plan.price }}</span>
															<span class="text-sm font-semibold text-foreground/80">{{ plan.currency }}</span>
															<span class="text-xs text-muted-foreground">/{{ plan.interval === 'month' ? 'mois' : plan.interval }}</span>
														}
													</div>

													@if (plan.trial_days > 0) {
														<span class="inline-block mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
															✨ {{ plan.trial_days }} jours d'essai gratuit
														</span>
													}
												</div>

												<!-- Liste des fonctionnalités -->
												<div class="py-4 space-y-2.5">
													<p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
														Inclus dans cette formule :
													</p>
													<ul class="space-y-2 text-xs sm:text-sm text-foreground/80">
														@for (feature of plan.features; track feature) {
															<li class="flex items-start gap-2">
																<ng-icon name="lucideCheck" class="text-primary shrink-0 text-base mt-0.5" />
																<span>{{ feature }}</span>
															</li>
														}
													</ul>
												</div>
											</div>

											<!-- Bouton d'action par carte -->
											<div class="pt-4 border-t border-border/40 mt-4">
												<button
													hlmBtn
													[variant]="selectedPlanId() === plan.id ? 'default' : 'outline'"
													class="w-full text-xs sm:text-sm font-semibold pointer-events-none"
												>
													@if (selectedPlanId() === plan.id) {
														<ng-icon name="lucideCheckCircle2" class="mr-1.5 text-sm" />
														Sélectionné
													} @else {
														Choisir ce plan
													}
												</button>
											</div>
										</div>
									}
								</div>
							}

							<!-- Barre d'action inférieure de l'étape 1 -->
							<div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/60">
								<div class="text-sm text-muted-foreground text-center sm:text-left">
									@if (selectedPlan()) {
										<span>Formule sélectionnée : </span>
										<strong class="text-foreground">{{ selectedPlan()?.name }}</strong>
										<span class="ml-1 text-xs">
											({{ selectedPlan()?.price === 0 ? 'Gratuit' : selectedPlan()?.price + ' ' + selectedPlan()?.currency + '/mois' }})
										</span>
									} @else {
										<span>Veuillez sélectionner un forfait pour continuer.</span>
									}
								</div>

								<div class="flex items-center gap-3 w-full sm:w-auto">
									<button
										hlmBtn
										spartanStepperNext
										[disabled]="!selectedPlanId()"
										class="w-full sm:w-auto px-6 cursor-pointer"
									>
										<span>Continuer vers la boutique</span>
										<ng-icon name="lucideArrowRight" class="ml-1.5 text-sm" />
									</button>
								</div>
							</div>
						</div>
					</spartan-step>

					<!-- ============================================== -->
					<!-- ÉTAPE 2 : IDENTITÉ DE LA BOUTIQUE              -->
					<!-- ============================================== -->
					<spartan-step label="Boutique">
						<div class="flex flex-col gap-8 py-2">
							<!-- En-tête de l'étape -->
							<div class="text-center max-w-2xl mx-auto space-y-2">
								<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-1">
									<ng-icon name="lucideStore" class="text-sm" />
									<span>Étape 2 sur 4</span>
								</div>
								<h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
									Identité de votre boutique
								</h2>
								<p class="text-muted-foreground text-sm sm:text-base">
									Donnez un nom à votre boutique et choisissez l'adresse web unique sur laquelle vos clients accéderont à votre catalogue.
								</p>
							</div>

							<!-- Formulaire de l'étape 2 -->
							<div class="max-w-2xl mx-auto w-full space-y-6 bg-card border border-border/60 rounded-2xl p-6 sm:p-8 shadow-xs">
								<!-- Nom de la boutique -->
								<div class="space-y-2">
									<label class="text-sm font-semibold text-foreground flex items-center justify-between">
										<span>Nom de la boutique <span class="text-destructive">*</span></span>
										<span class="text-xs text-muted-foreground font-normal">Min. 3 caractères</span>
									</label>
									<input
										hlmInput
										type="text"
										placeholder="Ex: Kinshasa Mode, AfroTech..."
										[ngModel]="shopName()"
										(ngModelChange)="onShopNameChange($event)"
										class="w-full"
									/>
									<p class="text-xs text-muted-foreground">
										Le nom officiel de votre enseigne qui sera affiché sur votre vitrine et vos factures.
									</p>
								</div>

								<!-- Sous-domaine / Adresse Web -->
								<div class="space-y-2">
									<label class="text-sm font-semibold text-foreground flex items-center justify-between">
										<span>Adresse web personnalisée <span class="text-destructive">*</span></span>
										<span class="text-xs text-muted-foreground font-normal">Sous-domaine Yetufy</span>
									</label>

									<!-- Input Group avec préfixe et suffixe -->
									<div class="relative flex items-center rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
										<span class="px-3 text-xs sm:text-sm text-muted-foreground select-none font-medium border-r border-border/60 bg-muted/40 py-2.5 rounded-l-lg">
											https://
										</span>
										<input
											type="text"
											placeholder="ma-boutique"
											[ngModel]="shopSlug()"
											(ngModelChange)="onShopSlugChange($event)"
											class="flex-1 bg-transparent px-3 py-2 text-sm font-mono tracking-tight outline-none placeholder:text-muted-foreground"
										/>
										<span class="px-3 text-xs sm:text-sm text-muted-foreground select-none font-medium border-l border-border/60 bg-muted/40 py-2.5 rounded-r-lg">
											.yetufy.com
										</span>
									</div>

									<!-- Statut de disponibilité du sous-domaine -->
									<div class="pt-1 min-h-[22px] flex items-center text-xs">
										@if (isCheckingSlug()) {
											<div class="inline-flex items-center gap-1.5 text-primary">
												<ng-icon name="lucideLoader2" class="animate-spin text-sm" />
												<span>Vérification de la disponibilité...</span>
											</div>
										} @else if (slugCheckResult()) {
											@if (slugCheckResult()?.available) {
												<div class="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
													<ng-icon name="lucideCheckCircle2" class="text-sm" />
													<span>Super ! <strong>{{ shopSlug() }}.yetufy.com</strong> est disponible.</span>
												</div>
											} @else {
												<div class="inline-flex items-center gap-1.5 text-destructive font-medium">
													<ng-icon name="lucideAlertCircle" class="text-sm" />
													<span>Ce sous-domaine est déjà pris ou non valide.</span>
												</div>
											}
										} @else if (slugFormatError()) {
											<div class="inline-flex items-center gap-1.5 text-destructive font-medium">
												<ng-icon name="lucideAlertCircle" class="text-sm" />
												<span>{{ slugFormatError() }}</span>
											</div>
										}
									</div>

									<!-- Suggestions d'alternatives si le slug est indisponible -->
									@if (slugSuggestions().length > 0 && !isCheckingSlug() && !slugCheckResult()?.available) {
										<div class="mt-3 p-3 rounded-lg bg-muted/40 border border-border/60 space-y-2">
											<p class="text-xs font-semibold text-foreground">Suggestions de sous-domaines disponibles :</p>
											<div class="flex flex-wrap gap-1.5">
												@for (suggestion of slugSuggestions(); track suggestion) {
													<button
														type="button"
														(click)="applySuggestion(suggestion)"
														class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-background border border-border hover:border-primary hover:text-primary transition-colors cursor-pointer"
													>
														<span>{{ suggestion }}</span>
														<span class="text-[10px] text-muted-foreground">.yetufy.com</span>
													</button>
												}
											</div>
										</div>
									}
								</div>

								<!-- Description de la boutique -->
								<div class="space-y-2">
									<div class="flex items-center justify-between">
										<label class="text-sm font-semibold text-foreground">
											Description de la boutique <span class="text-xs font-normal text-muted-foreground">(Optionnelle)</span>
										</label>
										<span class="text-xs text-muted-foreground font-mono">
											{{ shopDescription().length }}/500
										</span>
									</div>
									<textarea
										hlmTextarea
										rows="3"
										maxlength="500"
										placeholder="Décrivez brièvement les produits et services que vous proposez..."
										[ngModel]="shopDescription()"
										(ngModelChange)="shopDescription.set($event)"
										class="w-full resize-none text-sm"
									></textarea>
								</div>
							</div>

							<!-- Barre d'action inférieure de l'étape 2 -->
							<div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/60 max-w-2xl mx-auto w-full">
								<button
									hlmBtn
									variant="outline"
									spartanStepperPrevious
									class="w-full sm:w-auto cursor-pointer"
								>
									<ng-icon name="lucideArrowLeft" class="mr-1.5 text-sm" />
									<span>Retour à la formule</span>
								</button>

								<button
									hlmBtn
									spartanStepperNext
									[disabled]="!isStep2Valid()"
									class="w-full sm:w-auto px-6 cursor-pointer"
								>
									<span>Continuer vers les coordonnées</span>
									<ng-icon name="lucideArrowRight" class="ml-1.5 text-sm" />
								</button>
							</div>
						</div>
					</spartan-step>

					<!-- ============================================== -->
					<!-- ÉTAPE 3 : CONTACT & CONFIGURATION              -->
					<!-- ============================================== -->
					<spartan-step label="Coordonnées">
						<div class="flex flex-col gap-8 py-2">
							<!-- En-tête de l'étape -->
							<div class="text-center max-w-2xl mx-auto space-y-2">
								<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-1">
									<ng-icon name="lucideMail" class="text-sm" />
									<span>Étape 3 sur 4</span>
								</div>
								<h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
									Coordonnées & Préférences
								</h2>
								<p class="text-muted-foreground text-sm sm:text-base">
									Renseignez les coordonnées professionnelles de contact et configurez les préférences de facturation de votre boutique.
								</p>
							</div>

							<!-- Formulaire de l'étape 3 -->
							<div class="max-w-2xl mx-auto w-full space-y-6 bg-card border border-border/60 rounded-2xl p-6 sm:p-8 shadow-xs">
								<!-- Email de contact -->
								<div class="space-y-2">
									<label class="text-sm font-semibold text-foreground flex items-center justify-between">
										<span>Email de contact professionnel <span class="text-destructive">*</span></span>
										<span class="text-xs text-muted-foreground font-normal">Requis pour les notifications</span>
									</label>
									<div class="relative flex items-center">
										<span class="absolute left-3 text-muted-foreground">
											<ng-icon name="lucideMail" class="text-base" />
										</span>
										<input
											hlmInput
											type="email"
											placeholder="contact@maboutique.com"
											[ngModel]="contactEmail()"
											(ngModelChange)="contactEmail.set($event)"
											class="w-full pl-9"
										/>
									</div>
									<p class="text-xs text-muted-foreground">
										Cet email servira à recevoir les notifications de commandes et les échanges clients.
									</p>
								</div>

								<!-- Téléphone & Indicatif pays -->
								<div class="space-y-2">
									<label class="text-sm font-semibold text-foreground">
										Numéro de téléphone / WhatsApp professionnel
									</label>
									<div class="flex gap-2">
										<!-- Sélecteur indicatif -->
										<div class="w-36 shrink-0">
											<select
												[ngModel]="phoneCode()"
												(ngModelChange)="phoneCode.set($event)"
												class="w-full h-10 px-2.5 text-xs sm:text-sm font-medium rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
											>
												<option value="+243">🇨🇩 +243 (RDC)</option>
												<option value="+33">🇫🇷 +33 (France)</option>
												<option value="+1">🇺🇸 +1 (USA/CA)</option>
												<option value="+32">🇧🇪 +32 (Belgique)</option>
												<option value="+242">🇨🇬 +242 (Congo)</option>
												<option value="+250">🇷🇼 +250 (Rwanda)</option>
												<option value="+257">🇧🇮 +257 (Burundi)</option>
												<option value="+254">🇰🇪 +254 (Kenya)</option>
												<option value="+256">🇺🇬 +256 (Ouganda)</option>
												<option value="+255">🇹🇿 +255 (Tanzanie)</option>
												<option value="+27">🇿🇦 +27 (Afrique du Sud)</option>
											</select>
										</div>

										<!-- Input numéro local -->
										<div class="relative flex-1">
											<span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
												<ng-icon name="lucidePhone" class="text-base" />
											</span>
											<input
												hlmInput
												type="tel"
												placeholder="812 345 678"
												[ngModel]="contactPhone()"
												(ngModelChange)="contactPhone.set($event)"
												class="w-full pl-9"
											/>
										</div>
									</div>
									<p class="text-xs text-muted-foreground">
										Permettra à vos clients de vous contacter directement pour leurs commandes ou demandes de livraison.
									</p>
								</div>

								<!-- Paramètres régionaux (Devise & Langue) -->
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/40">
									<!-- Devise -->
									<div class="space-y-2">
										<label class="text-sm font-semibold text-foreground flex items-center gap-1.5">
											<ng-icon name="lucideCoins" class="text-primary text-sm" />
											<span>Devise principale</span>
										</label>
										<div class="grid grid-cols-2 gap-2">
											<button
												type="button"
												(click)="currency.set('CDF')"
												[class.border-primary]="currency() === 'CDF'"
												[class.bg-primary/10]="currency() === 'CDF'"
												[class.text-primary]="currency() === 'CDF'"
												class="flex flex-col items-center justify-center p-3 rounded-lg border border-border text-xs font-semibold cursor-pointer transition-colors"
											>
												<span class="text-sm font-bold">CDF</span>
												<span class="text-[10px] text-muted-foreground font-normal">Franc Congolais</span>
											</button>

											<button
												type="button"
												(click)="currency.set('USD')"
												[class.border-primary]="currency() === 'USD'"
												[class.bg-primary/10]="currency() === 'USD'"
												[class.text-primary]="currency() === 'USD'"
												class="flex flex-col items-center justify-center p-3 rounded-lg border border-border text-xs font-semibold cursor-pointer transition-colors"
											>
												<span class="text-sm font-bold">USD</span>
												<span class="text-[10px] text-muted-foreground font-normal">Dollar ($)</span>
											</button>
										</div>
									</div>

									<!-- Langue -->
									<div class="space-y-2">
										<label class="text-sm font-semibold text-foreground flex items-center gap-1.5">
											<ng-icon name="lucideLanguages" class="text-primary text-sm" />
											<span>Langue de la boutique</span>
										</label>
										<div class="grid grid-cols-2 gap-2">
											<button
												type="button"
												(click)="language.set('fr')"
												[class.border-primary]="language() === 'fr'"
												[class.bg-primary/10]="language() === 'fr'"
												[class.text-primary]="language() === 'fr'"
												class="flex flex-col items-center justify-center p-3 rounded-lg border border-border text-xs font-semibold cursor-pointer transition-colors"
											>
												<span class="text-sm font-bold">Français</span>
												<span class="text-[10px] text-muted-foreground font-normal">Par défaut</span>
											</button>

											<button
												type="button"
												(click)="language.set('en')"
												[class.border-primary]="language() === 'en'"
												[class.bg-primary/10]="language() === 'en'"
												[class.text-primary]="language() === 'en'"
												class="flex flex-col items-center justify-center p-3 rounded-lg border border-border text-xs font-semibold cursor-pointer transition-colors"
											>
												<span class="text-sm font-bold">English</span>
												<span class="text-[10px] text-muted-foreground font-normal">Anglais</span>
											</button>
										</div>
									</div>
								</div>
							</div>

							<!-- Barre d'action inférieure de l'étape 3 -->
							<div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/60 max-w-2xl mx-auto w-full">
								<button
									hlmBtn
									variant="outline"
									spartanStepperPrevious
									class="w-full sm:w-auto cursor-pointer"
								>
									<ng-icon name="lucideArrowLeft" class="mr-1.5 text-sm" />
									<span>Retour à la boutique</span>
								</button>

								<button
									hlmBtn
									spartanStepperNext
									[disabled]="!isStep3Valid()"
									class="w-full sm:w-auto px-6 cursor-pointer"
								>
									<span>Vérifier et confirmer</span>
									<ng-icon name="lucideArrowRight" class="ml-1.5 text-sm" />
								</button>
							</div>
						</div>
					</spartan-step>

					<!-- ============================================== -->
					<!-- ÉTAPE 4 : CONFIRMATION & LANCEMENT             -->
					<!-- ============================================== -->
					<spartan-step label="Confirmation">
						<div class="flex flex-col gap-8 py-2">
							<!-- En-tête de l'étape -->
							<div class="text-center max-w-2xl mx-auto space-y-2">
								<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-1">
									<ng-icon name="lucideShieldCheck" class="text-sm" />
									<span>Étape 4 sur 4</span>
								</div>
								<h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
									Récapitulatif Et Finalisation
								</h2>
								<p class="text-muted-foreground text-sm sm:text-base">
									Vérifiez les paramètres de votre boutique avant de procéder à sa création officielle.
								</p>
							</div>

							<!-- Message d'erreur serveur éventuel -->
							@if (submissionError()) {
								<div class="max-w-2xl mx-auto w-full rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive font-medium flex items-start gap-2.5">
									<ng-icon name="lucideAlertCircle" class="text-lg shrink-0 mt-0.5" />
									<div>
										<p class="font-bold">Erreur lors de la création de la boutique :</p>
										<p>{{ submissionError() }}</p>
									</div>
								</div>
							}

							<!-- Cartes récapitulatives -->
							<div class="max-w-2xl mx-auto w-full space-y-4">
								<!-- Récap Formule -->
								<div class="rounded-xl border border-border/60 bg-card p-4 sm:p-5 flex items-center justify-between">
									<div class="space-y-0.5">
										<span class="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Formule choisie</span>
										<h4 class="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
											<span>{{ selectedPlan()?.name }}</span>
											@if (selectedPlan()?.is_recommended) {
												<span class="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
													Recommandé
												</span>
											}
										</h4>
										<p class="text-xs text-muted-foreground">
											{{ selectedPlan()?.price === 0 ? 'Gratuit sans engagement' : selectedPlan()?.price + ' ' + selectedPlan()?.currency + ' par mois' }}
										</p>
									</div>
									<div class="text-right">
										<span class="text-xl sm:text-2xl font-extrabold text-foreground">
											{{ selectedPlan()?.price === 0 ? 'Gratuit' : selectedPlan()?.price + ' ' + selectedPlan()?.currency }}
										</span>
									</div>
								</div>

								<!-- Récap Boutique & Adresse -->
								<div class="rounded-xl border border-border/60 bg-card p-4 sm:p-5 space-y-3">
									<span class="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Informations Boutique</span>

									<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
										<div>
											<span class="text-xs text-muted-foreground block">Nom :</span>
											<span class="font-semibold text-foreground">{{ shopName() }}</span>
										</div>
										<div>
											<span class="text-xs text-muted-foreground block">Lien web :</span>
											<span class="font-mono text-xs font-semibold text-primary">https://{{ shopSlug() }}.yetufy.com</span>
										</div>
										@if (shopDescription()) {
											<div class="sm:col-span-2">
												<span class="text-xs text-muted-foreground block">Description :</span>
												<span class="text-xs text-foreground/80 line-clamp-2">{{ shopDescription() }}</span>
											</div>
										}
									</div>
								</div>

								<!-- Récap Contact & Préférences -->
								<div class="rounded-xl border border-border/60 bg-card p-4 sm:p-5 space-y-3">
									<span class="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Contact & Paramètres</span>

									<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
										<div>
											<span class="text-xs text-muted-foreground block">Email de contact :</span>
											<span class="font-medium text-foreground">{{ contactEmail() }}</span>
										</div>
										<div>
											<span class="text-xs text-muted-foreground block">Téléphone :</span>
											<span class="font-medium text-foreground">
												{{ contactPhone() ? (phoneCode() + ' ' + contactPhone()) : 'Non renseigné' }}
											</span>
										</div>
										<div>
											<span class="text-xs text-muted-foreground block">Devise :</span>
											<span class="font-semibold text-foreground">{{ currency() === 'CDF' ? 'CDF (Franc Congolais)' : 'USD (Dollar $)' }}</span>
										</div>
										<div>
											<span class="text-xs text-muted-foreground block">Langue :</span>
											<span class="font-semibold text-foreground">{{ language() === 'fr' ? 'Français' : 'English' }}</span>
										</div>
									</div>
								</div>

								<!-- Conditions générales d'utilisation -->
								<div class="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-2">
									<label class="flex items-start gap-3 cursor-pointer select-none">
										<input
											type="checkbox"
											[ngModel]="acceptTerms()"
											(ngModelChange)="acceptTerms.set($event)"
											class="size-4 mt-0.5 rounded border-border text-primary focus:ring-primary cursor-pointer shrink-0"
										/>
										<span class="text-xs text-muted-foreground leading-relaxed">
											J'accepte les <a href="#" class="text-primary underline">Conditions Générales d'Utilisation</a> de Yetufy ainsi que la politique de confidentialité relative aux marchands en ligne.
										</span>
									</label>
								</div>
							</div>

							<!-- Barre d'action finale -->
							<div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/60 max-w-2xl mx-auto w-full">
								<button
									hlmBtn
									variant="outline"
									spartanStepperPrevious
									[disabled]="isSubmitting()"
									class="w-full sm:w-auto cursor-pointer"
								>
									<ng-icon name="lucideArrowLeft" class="mr-1.5 text-sm" />
									<span>Modifier mes coordonnées</span>
								</button>

								<button
									hlmBtn
									(click)="submitShop()"
									[disabled]="!acceptTerms() || isSubmitting()"
									class="w-full sm:w-auto px-8 cursor-pointer font-semibold"
								>
									@if (isSubmitting()) {
										<ng-icon name="lucideLoader2" class="animate-spin mr-2 text-base" />
										<span>Création en cours...</span>
									} @else {
										<span>Créer ma boutique</span>
										<ng-icon name="lucideSparkles" class="ml-2 text-sm" />
									}
								</button>
							</div>
						</div>
					</spartan-step>
				</spartan-stepper>
				}
			</div>
		</div>
	`,
})
export default class StepperBasicPage implements OnInit {
	private tenantService = inject(TenantService);
	private authUsers = inject(AuthUsers);
	private router = inject(Router);

	// --- Étape 1 : Plans ---
	protected plans = signal<Plan[]>([]);
	protected isLoadingPlans = signal<boolean>(true);
	protected loadError = signal<string | null>(null);
	protected selectedPlanId = signal<string | null>(null);

	protected selectedPlan = computed(() =>
		this.plans().find((p) => p.id === this.selectedPlanId())
	);

	// --- Étape 2 : Identité de la boutique ---
	protected shopName = signal<string>('');
	protected shopSlug = signal<string>('');
	protected shopDescription = signal<string>('');

	protected isSlugManuallyEdited = signal<boolean>(false);
	protected isCheckingSlug = signal<boolean>(false);
	protected slugCheckResult = signal<{ available: boolean; cleaned_slug: string } | null>(null);
	protected slugSuggestions = signal<string[]>([]);
	protected slugFormatError = signal<string | null>(null);

	private checkSlugTimeout: any = null;

	// Validation de l'étape 2
	protected isStep2Valid = computed(() => {
		const nameOk = this.shopName().trim().length >= 3;
		const slugOk = this.shopSlug().trim().length >= 3;
		const available = this.slugCheckResult()?.available === true;
		const notChecking = !this.isCheckingSlug();
		return nameOk && slugOk && available && notChecking;
	});

	// --- Étape 3 : Coordonnées & Préférences ---
	protected contactEmail = signal<string>('');
	protected contactPhone = signal<string>('');
	protected phoneCode = signal<string>('+243');
	protected currency = signal<string>('CDF');
	protected language = signal<string>('fr');

	// Validation de l'étape 3
	protected isStep3Valid = computed(() => {
		const email = this.contactEmail().trim();
		const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		return emailOk;
	});

	// --- Étape 4 : Confirmation & Soumission ---
	protected acceptTerms = signal<boolean>(false);
	protected isSubmitting = signal<boolean>(false);
	protected submissionError = signal<string | null>(null);
	protected createdShop = signal<CreatedShopSuccess | null>(null);

	ngOnInit(): void {
		this.loadPlans();

		// Pré-remplir l'email de contact avec l'utilisateur connecté s'il existe
		const user = this.authUsers.currentUser();
		if (user?.email) {
			this.contactEmail.set(user.email);
		} else {
			const saved = localStorage.getItem('user_data');
			if (saved) {
				try {
					const parsed = JSON.parse(saved);
					if (parsed?.email) {
						this.contactEmail.set(parsed.email);
					}
				} catch (e) {
					// Ignore
				}
			}
		}
	}

	loadPlans(): void {
		this.isLoadingPlans.set(true);
		this.loadError.set(null);

		this.tenantService.getPlans().subscribe({
			next: (response) => {
				const availablePlans = response.plans || [];
				this.plans.set(availablePlans);
				this.isLoadingPlans.set(false);

				if (availablePlans.length > 0 && !this.selectedPlanId()) {
					const recommended = availablePlans.find((p) => p.is_recommended);
					const defaultPlan = recommended || availablePlans[0];
					this.selectedPlanId.set(defaultPlan.id);
				}
			},
			error: (err) => {
				console.error('Erreur lors du chargement des plans:', err);
				this.loadError.set('Impossible de charger les formules. Vérifiez votre connexion.');
				this.isLoadingPlans.set(false);
			},
		});
	}

	selectPlan(planId: string): void {
		this.selectedPlanId.set(planId);
	}

	onShopNameChange(value: string): void {
		this.shopName.set(value);

		if (!this.isSlugManuallyEdited()) {
			const autoSlug = this.generateSlug(value);
			this.shopSlug.set(autoSlug);
			this.triggerSlugCheck(autoSlug);
		}
	}

	onShopSlugChange(value: string): void {
		this.isSlugManuallyEdited.set(true);
		const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
		this.shopSlug.set(cleaned);
		this.triggerSlugCheck(cleaned);
	}

	applySuggestion(suggestion: string): void {
		this.isSlugManuallyEdited.set(true);
		this.shopSlug.set(suggestion);
		this.triggerSlugCheck(suggestion);
	}

	private generateSlug(text: string): string {
		return text
			.toLowerCase()
			.trim()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
			.slice(0, 50);
	}

	private triggerSlugCheck(slug: string): void {
		if (this.checkSlugTimeout) {
			clearTimeout(this.checkSlugTimeout);
		}

		this.slugCheckResult.set(null);
		this.slugSuggestions.set([]);
		this.slugFormatError.set(null);

		if (!slug || slug.trim().length < 3) {
			if (slug.length > 0) {
				this.slugFormatError.set('Le sous-domaine doit contenir au moins 3 caractères.');
			}
			return;
		}

		if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
			this.slugFormatError.set('Le sous-domaine ne peut contenir que des lettres minuscules, chiffres et tirets.');
			return;
		}

		this.isCheckingSlug.set(true);

		this.checkSlugTimeout = setTimeout(() => {
			this.tenantService.checkDomain(slug).subscribe({
				next: (res) => {
					this.isCheckingSlug.set(false);
					this.slugCheckResult.set({
						available: res.available,
						cleaned_slug: res.cleaned_slug,
					});

					if (!res.available && res.suggestions && res.suggestions.length > 0) {
						this.slugSuggestions.set(res.suggestions);
					}
				},
				error: (err) => {
					console.error('Erreur vérification domaine:', err);
					this.isCheckingSlug.set(false);
				},
			});
		}, 400);
	}

	// Soumission finale de création de la boutique
	submitShop(): void {
		if (!this.selectedPlanId() || !this.isStep2Valid() || !this.isStep3Valid() || !this.acceptTerms()) {
			return;
		}

		this.isSubmitting.set(true);
		this.submissionError.set(null);

		const payload = {
			plan_id: this.selectedPlanId(),
			shop_name: this.shopName().trim(),
			shop_slug: this.shopSlug().trim().toLowerCase(),
			shop_description: this.shopDescription().trim() || null,
			contact_email: this.contactEmail().trim(),
			contact_phone: this.contactPhone().trim() || null,
			phone_code: this.phoneCode(),
			currency: this.currency(),
			language: this.language(),
			accept_terms: true,
		};

		this.tenantService.createShop(payload).subscribe({
			next: (res: CreatedShopSuccess) => {
				this.isSubmitting.set(false);
				this.createdShop.set(res);
			},
			error: (err) => {
				console.error('Erreur lors de la création de la boutique:', err);
				this.isSubmitting.set(false);

				if (err?.status === 422 && err?.error?.errors) {
					const messages = Object.values(err.error.errors).flat().join(' ');
					this.submissionError.set(messages || err.error.message);
				} else {
					this.submissionError.set(
						err?.error?.message || 'Une erreur est survenue lors de la création de la boutique.'
					);
				}
			},
		});
	}

	goToDashboard(): void {
		this.router.navigate(['/admin']);
	}

	resetStepper(): void {
		this.createdShop.set(null);
		this.shopName.set('');
		this.shopSlug.set('');
		this.shopDescription.set('');
		this.acceptTerms.set(false);
		this.isSlugManuallyEdited.set(false);
	}
}