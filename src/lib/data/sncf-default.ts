import type { Campaign } from '$lib/types';

export const SNCF_DEFAULT_CAMPAIGN: Campaign = {
	id: 'sncf-connect-2026',
	name: 'Test utilisateur – Parcours de réservation SNCF Connect',
	dateRange: 'Semaine du 22 au 26 juin 2026',
	objectives: [
		'Évaluer la facilité avec laquelle un utilisateur trouve et réserve un trajet en train avec des critères précis (budget, carte de réduction)',
		'Vérifier la visibilité et la compréhension du parcours d\'achat des cartes de réduction',
		'Identifier les points de friction dans le module de location de voiture (options, assurance, conducteur supplémentaire)',
		'Mesurer la facilité de consultation des horaires de passage d\'un train en gare intermédiaire'
	],
	testers: [
		{
			id: 'tester-sophie',
			name: 'Sophie M.',
			persona: 'Marianne (39 ans, RH)',
			testDate: 'Lundi 22 juin 2026, 18h30',
			context: 'À distance (visio), depuis son domicile, sur smartphone personnel'
		},
		{
			id: 'tester-karim',
			name: 'Karim B.',
			persona: 'Lucas (21 ans, étudiant)',
			testDate: 'Mercredi 24 juin 2026, 11h00',
			context: 'En présentiel, chez le testeur, sur son propre smartphone'
		},
		{
			id: 'tester-elodie',
			name: 'Élodie T.',
			persona: 'Profil mixte Marianne / Lucas',
			testDate: 'Jeudi 25 juin 2026, 19h00',
			context: 'En présentiel, salle de réunion partagée, sur smartphone personnel'
		}
	],
	scenarios: [
		{
			id: 'scenario-1',
			order: 1,
			title: 'Réservation Brest – Strasbourg avec carte de réduction',
			objective:
				'Évaluer la capacité de l\'utilisateur à effectuer une recherche de trajet avec contraintes (date, budget) et à appliquer une carte de réduction lors de la réservation',
			task: 'Réservez un trajet Brest – Strasbourg pour un jeudi du mois prochain, avec un budget de 180 €, et insérez une carte de réduction. Arrêtez-vous juste avant le paiement.',
			successCriteria: [
				'Sélectionne correctement les villes de départ et d\'arrivée',
				'Choisit une date de jeudi du mois suivant',
				'Identifie une offre respectant le budget de 180 €',
				'Ajoute une carte de réduction avant l\'écran de paiement, sans aide extérieure'
			],
			phases: [
				{ id: 's1-recherche', name: 'Recherche trajet' },
				{ id: 's1-budget', name: 'Filtrage budget' },
				{ id: 's1-carte', name: 'Carte réduction' },
				{ id: 's1-paiement', name: 'Pré-paiement' }
			]
		},
		{
			id: 'scenario-2',
			order: 2,
			title: 'Achat carte de réduction adaptée à l\'âge',
			objective:
				'Vérifier que l\'utilisateur trouve facilement la rubrique des cartes de réduction et identifie celle qui correspond à son profil',
			task: 'Achetez une carte de réduction qui correspond à votre tranche d\'âge. Arrêtez-vous juste avant le paiement.',
			successCriteria: [
				'Localise la section dédiée aux cartes de réduction',
				'Compare les options proposées',
				'Sélectionne la carte correspondant à son âge',
				'Arrive jusqu\'à l\'écran précédant le paiement sans confusion'
			],
			phases: [
				{ id: 's2-navigation', name: 'Navigation' },
				{ id: 's2-comparaison', name: 'Comparaison options' },
				{ id: 's2-selection', name: 'Sélection carte' },
				{ id: 's2-paiement', name: 'Pré-paiement' }
			]
		},
		{
			id: 'scenario-3',
			order: 3,
			title: 'Location voiture Marseille avec options',
			objective:
				'Observer la facilité de configuration d\'une location de voiture avec plusieurs options additionnelles (assurance, conducteur supplémentaire)',
			task: 'Réservez une voiture 5 portes au départ de l\'aéroport de Marseille pour 3 jours à compter du lendemain du jour du test, avec une assurance et un conducteur supplémentaire. Arrêtez-vous juste avant le paiement.',
			successCriteria: [
				'Configure correctement le lieu de prise en charge',
				'Définit les dates (3 jours à partir du lendemain)',
				'Sélectionne le type de véhicule (5 portes)',
				'Ajoute l\'assurance et un conducteur supplémentaire avant le paiement'
			],
			phases: [
				{ id: 's3-recherche', name: 'Recherche location' },
				{ id: 's3-vehicule', name: 'Choix véhicule' },
				{ id: 's3-options', name: 'Options (assurance, conducteur)' },
				{ id: 's3-paiement', name: 'Pré-paiement' }
			]
		},
		{
			id: 'scenario-4',
			order: 4,
			title: 'Horaires train en gare intermédiaire',
			objective:
				'Évaluer la capacité de l\'utilisateur à retrouver les horaires de passage d\'un train précis à une gare qui n\'est ni le départ ni l\'arrivée du trajet',
			task: 'Un de vos amis voyage de Gap à Paris Austerlitz en train de nuit mardi prochain. Vous êtes près de la gare de Die. Cherchez à quelle heure le train passe par cette gare pour prendre le même train que lui.',
			successCriteria: [
				'Identifie le bon train de nuit Gap – Paris Austerlitz du mardi suivant',
				'Trouve l\'heure exacte de passage à la gare de Die',
				'Sans se tromper de train ni de gare'
			],
			phases: [
				{ id: 's4-recherche', name: 'Recherche horaires' },
				{ id: 's4-train', name: 'Identification train' },
				{ id: 's4-gare', name: 'Passage gare intermédiaire' }
			]
		}
	],
	observations: [],
	results: []
};
