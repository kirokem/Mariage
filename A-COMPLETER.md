# Liste des `[À COMPLÉTER]`

Tant qu'elles ne sont pas remplies, ces informations s'affichent sur le site sous la forme d'un marqueur **[À COMPLÉTER]** surligné en jaune, pour qu'aucune ne passe inaperçue.

## 1. Textes du site : `site/content.php`

Dans ce fichier, chaque information manquante est écrite `TODO`. Remplacez `TODO` par votre texte entre apostrophes, par exemple `'heure' => '11h00',`.

| # | Information | Section du site | Emplacement dans `site/content.php` |
|---|---|---|---|
| 1 | Horaire du brunch | Programme › Dimanche | `programme` › `jours` › Dimanche › `heure` (l. 148) |
| 2 | Lieu du brunch dans le domaine | Programme › Dimanche | `programme` › `jours` › Dimanche › `lieu` (l. 149) |
| 3 | Informations parking | Accès | `acces` › `blocs` › Parking › `texte` (l. 174) |
| 4 | Venir en train ou en avion (gares, aéroports…). *Bloc facultatif, supprimable.* | Accès | `acces` › `blocs` › En train ou en avion › `texte` (l. 183) |
| 5 | Heure d'arrivée (check-in) | Hébergement | `hebergement` › `details` (l. 197) |
| 6 | Heure de départ (check-out) | Hébergement | `hebergement` › `details` (l. 198) |
| 7 | Autres détails pratiques (« Bon à savoir »). *Ligne supprimable.* | Hébergement | `hebergement` › `details` (l. 199) |
| 8 | Autres questions de la FAQ (question et réponse ; ajoutez-en autant que nécessaire) | Infos pratiques | `infos` › `questions` (l. 234–235) |
| 9 | Date limite de réponse au RSVP | RSVP | `rsvp` › `date_limite` (l. 246) |
| 10 | E-mail de contact des mariés | Contact | `contact` › `email` (l. 307) |
| 11 | Téléphone de Charlène | Contact | `contact` › `personnes` (l. 309) |
| 12 | Téléphone de Julien | Contact | `contact` › `personnes` (l. 310) |

Les numéros de ligne correspondent à la version livrée et peuvent bouger quand vous modifiez le fichier. Le plus simple est de rechercher `TODO`.

## 2. Configuration : `site/config.php` (non versionné)

| # | Information | Clé |
|---|---|---|
| 13 | Hash du mot de passe du faire-part | `password_hash` (voir README › « Mot de passe ») |
| 14 | Clé secrète | `secret_key` |
| 15 | Adresse e-mail d'envoi et son mot de passe (SMTP Infomaniak) | `smtp` › `username` / `password`, `from_email` |
| 16 | Adresse(s) qui reçoivent les réponses RSVP | `rsvp_recipients` |

## 3. Déploiement

| # | Information | Où |
|---|---|---|
| 17 | Emplacement exact du site sur `charlene-julien.ch` (racine ou sous-domaine) | Manager Infomaniak : dossier cible du dépôt FTP (voir README › « Déploiement ») |

## 4. Photos (facultatif)

| # | Information | Où |
|---|---|---|
| 18 | Photos de couple, et choix de leur emplacement (accueil, après le programme, après les infos pratiques) | `photos/`, puis `site/content.php` › `photos` (voir README › « Photos ») |

## 5. Textes rédigés à valider

Ces phrases ne figuraient pas mot pour mot dans le cahier des charges. Je les ai écrites pour compléter les ambiances : relisez-les et modifiez-les librement.

- Programme › Vendredi, sous-titre « Bienvenue ». Programme › Cocktail : « Un verre à la main, le temps de se retrouver. »
- Programme › Brunch, ambiance : « Pour prolonger la fête en douceur, avant de se dire au revoir. »
- Accueil, surtitre « Nous nous marions ». Pied de page, « Avec toute notre affection ».
- Messages de confirmation du RSVP et textes des e-mails d'accusé de réception (`rsvp` › `merci_oui`, `merci_non`, `email_invite_oui`, `email_invite_non`).
