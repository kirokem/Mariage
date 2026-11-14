# Charlène & Julien : site du mariage

Site du mariage de Charlène et Julien, du 11 au 13 juin 2027, au Château des Oliviers de Salettes (Drôme provençale).

- Une seule page, pensée d'abord pour le mobile : Accueil, Programme, Accès, Hébergement, Infos pratiques, RSVP et Contact.
- Tout le site est protégé par le mot de passe imprimé sur le faire-part.
- Le formulaire RSVP envoie ses réponses **uniquement par e-mail**, via le SMTP Infomaniak. Il n'y a aucune base de données.
- PHP 8, HTML, CSS et JavaScript, sans framework ni étape de build. Les polices sont auto-hébergées. Aucun traceur, aucun analytics, aucun appel à un service externe.

> **Liste de tout ce qui reste à compléter :** [`A-COMPLETER.md`](A-COMPLETER.md)

---

## Arborescence

```
.
├── README.md               ce fichier
├── A-COMPLETER.md          liste des informations manquantes
├── photos/                 vos photos ORIGINALES (non publiées, non versionnées)
├── tools/
│   ├── hash-password.php   génère le hash du mot de passe + la clé secrète
│   ├── optimize-photos.sh  convertit les photos en WebP multi-tailles
│   └── make-favicon.py     a servi à générer le favicon « C&J »
└── site/                   ← TOUT CE DOSSIER est à déposer sur Infomaniak
    ├── index.php           page d'entrée (mot de passe) puis site complet
    ├── rsvp.php            réception du formulaire RSVP
    ├── content.php         ★ TOUS LES TEXTES DU SITE (à modifier ici)
    ├── config.example.php  modèle de configuration
    ├── config.php          ★ configuration sensible (à créer, jamais versionnée)
    ├── .htaccess           HTTPS forcé, sécurité, cache, fichiers protégés
    ├── robots.txt          interdit l'indexation
    ├── favicon.svg / favicon.ico / apple-touch-icon.png
    ├── inc/                code PHP (non accessible depuis le web)
    │   ├── bootstrap.php   chargement, fonctions utilitaires, photos
    │   ├── security.php    en-têtes de sécurité, contrôle d'origine
    │   ├── auth.php        mot de passe, cookie de connexion, jeton CSRF
    │   ├── ratelimit.php   limitation des envois et des essais par IP
    │   ├── rsvp.php        validation et préparation des e-mails
    │   ├── mailer.php      envoi SMTP (PHPMailer)
    │   └── views/          gabarits HTML (page, sections, e-mails)
    ├── lib/PHPMailer/      PHPMailer 6.12.0 inclus (licence LGPL 2.1)
    ├── storage/            compteurs anti-abus, journal d'erreurs (protégé)
    └── assets/
        ├── css/site.css
        ├── js/site.js
        ├── fonts/          Bebas Neue + Inter (woff2, licence OFL)
        └── photos/         photos WebP générées
```

Les fichiers `content.php`, `config.php`, et les dossiers `inc/`, `lib/` et `storage/` sont protégés par le `.htaccess` : on ne peut pas les ouvrir depuis un navigateur.

---

## 1. Modifier les textes

Tout se trouve dans **`site/content.php`** : programme, adresses, FAQ, libellés du formulaire, contacts, date limite du RSVP, etc. Les règles d'édition sont rappelées en tête du fichier.

- Les informations encore inconnues sont écrites `TODO` et apparaissent sur le site sous la forme **[À COMPLÉTER]** surlignée en jaune.
- Pour masquer une ligne, mettez `''` (deux apostrophes vides).
- Après une modification, déposez simplement le nouveau `content.php` sur le serveur.

> Pour vérifier qu'il n'y a pas d'erreur de syntaxe avant de déposer le fichier : `php -l site/content.php`

---

## 2. Configuration (`site/config.php`)

```bash
cp site/config.example.php site/config.php
```

### Mot de passe du faire-part

Le mot de passe n'est **jamais** stocké en clair : seul son *hash* figure dans `config.php`. Pour le générer :

```bash
php tools/hash-password.php
```

Tapez le mot de passe (il ne s'affiche pas), puis copiez les deux lignes affichées dans `site/config.php` :

- `password_hash` : le hash du mot de passe ;
- `secret_key` : une clé aléatoire qui signe le cookie de connexion.

Sans PHP sur votre ordinateur, vous pouvez obtenir le hash avec cette commande, lancée en SSH sur le serveur Infomaniak :

```bash
php -r 'echo password_hash(readline("Mot de passe : "), PASSWORD_DEFAULT), PHP_EOL;'
```

**Comment fonctionne l'accès.** Quand l'invité saisit le bon mot de passe, PHP le vérifie avec `password_verify` et lui dépose un cookie signé (HMAC-SHA256) valable **60 jours** (`auth_days`). Ce cookie est revérifié côté serveur à chaque visite.

On n'utilise pas une simple session PHP : sur un hébergement mutualisé, les fichiers de session sont effacés au bout de quelques heures, et les invités devraient retaper le code. Changer le mot de passe ou la `secret_key` déconnecte tout le monde.

Après 10 mots de passe erronés en 15 minutes, une même adresse IP doit patienter avant de réessayer. Ce réglage se trouve dans `limits`.

### E-mails (SMTP Infomaniak)

1. Dans le Manager Infomaniak, créez (ou choisissez) une adresse e-mail d'envoi sur votre domaine, par exemple `rsvp@charlene-julien.ch`.
2. Renseignez dans `config.php` :

```php
'smtp' => [
    'host'       => 'mail.infomaniak.com',
    'port'       => 465,          // ou 587
    'encryption' => 'ssl',        // 'ssl' pour 465, 'tls' pour 587
    'username'   => 'rsvp@charlene-julien.ch',   // adresse complète
    'password'   => 'mot de passe de cette adresse',
],
'from_email' => 'rsvp@charlene-julien.ch',        // la même adresse
'from_name'  => 'Charlène & Julien',
'rsvp_recipients' => ['votre-adresse@exemple.ch'], // qui reçoit les réponses
```

- `from_email` doit être l'adresse du compte SMTP. Sinon, Infomaniak refuse l'envoi ou les messages finissent en spam.
- Les mariés reçoivent un récapitulatif. Un clic sur « Répondre » écrit directement à l'invité.
- L'invité reçoit un accusé de réception avec le récapitulatif de sa réponse. S'il y répond, son message arrive à la première adresse de `rsvp_recipients`.

---

## 3. Déploiement sur Infomaniak (hébergement Web mutualisé)

> ⚠️ Un autre outil existe déjà sur un sous-domaine de `charlene-julien.ch`. **N'y touchez pas** : ce site est totalement indépendant. Déposez-le uniquement dans le dossier de son propre site, à la racine ou sur un sous-domaine dédié. Cet emplacement reste **[À COMPLÉTER]**.

**Avant le premier dépôt, dans le Manager Infomaniak :**

- vérifiez que le site utilise **PHP 8.1 ou plus récent** ;
- activez le **certificat SSL** (Let's Encrypt) : le `.htaccess` force le HTTPS.

### Par FTP / SFTP (FileZilla, Cyberduck…)

1. Récupérez les identifiants FTP/SFTP dans le Manager (section FTP / SSH de l'hébergement).
2. Ouvrez le dossier qui correspond à **ce** site (le dossier racine du domaine ou du sous-domaine choisi).
3. Déposez **le contenu** du dossier `site/` : `index.php`, `rsvp.php`, `.htaccess`, `assets/`, `inc/`, etc. Ne déposez pas le dossier `site/` lui-même. Affichez les fichiers cachés pour que le `.htaccess` parte bien.
4. Déposez votre `config.php` rempli (une seule fois, puis à chaque modification).
5. Vérifiez que le dossier `storage/` est inscriptible par PHP (droits `755`, c'est le cas par défaut chez Infomaniak).

### Par SSH (rsync)

Si l'accès SSH est activé, depuis la racine du projet :

```bash
rsync -avz --delete --exclude config.php --exclude 'storage/*' --exclude 'storage/.htaccess' site/ UTILISATEUR@SERVEUR:CHEMIN/DU/SITE/
```

Pour déposer la configuration la première fois :

```bash
scp site/config.php UTILISATEUR@SERVEUR:CHEMIN/DU/SITE/config.php
```

`--delete` supprime sur le serveur les fichiers qui n'existent plus en local, mais uniquement dans le dossier ciblé. Vérifiez bien `CHEMIN/DU/SITE` pour ne jamais viser le dossier de l'autre outil.

### Vérifications après dépôt

- `https://…/` affiche la page d'entrée.
- `https://…/content.php`, `https://…/config.php` et `https://…/inc/` répondent **403 Interdit**.
- `https://…/robots.txt` affiche `Disallow: /`.

---

## 4. Tester l'envoi du RSVP

### En ligne, après déploiement

1. Connectez-vous avec le mot de passe, puis remplissez le formulaire avec votre propre adresse e-mail.
2. Vérifiez que **deux e-mails** arrivent : le récapitulatif (aux adresses de `rsvp_recipients`) et l'accusé de réception (à l'adresse saisie). Pensez à regarder dans les spams.
3. En cas d'échec, le formulaire affiche un message d'erreur poli. Le détail technique est consigné dans `storage/logs/erreurs.log`, que vous pouvez lire par FTP. Pour un diagnostic plus complet, passez temporairement `'debug' => true` dans `config.php`.

Le formulaire accepte **5 envois par heure et par adresse IP**, réglables dans `limits`. Pendant vos tests, si vous atteignez la limite, supprimez le dossier `storage/ratelimit/` par FTP.

### En local, sans envoyer de vrais e-mails

Il faut PHP 8 et Python 3. Lancez un faux serveur SMTP qui affiche les e-mails dans le terminal :

```bash
pip install aiosmtpd
python3 -m aiosmtpd -n -l 127.0.0.1:2525
```

Dans `site/config.php` (copie de test), indiquez :

```php
'smtp' => ['host' => '127.0.0.1', 'port' => 2525, 'encryption' => 'none', 'username' => '', 'password' => ''],
```

Lancez ensuite le site :

```bash
php -S 127.0.0.1:8080 -t site
```

Puis ouvrez http://127.0.0.1:8080. Le serveur intégré de PHP ignore le `.htaccess`, ce qui est normal en local.

### Protections du formulaire

- **Jeton CSRF** signé, lié au cookie de l'invité.
- **Vérification de l'origine** de la requête.
- **Champ piège invisible (honeypot)** et rejet des envois faits en moins de 3 secondes. Dans ces deux cas, le robot voit un faux « merci » et aucun e-mail ne part.
- **Limite d'envois par IP.** Les adresses IP sont hachées et jamais stockées en clair.
- **Validation complète côté serveur** et échappement de toutes les données affichées ou envoyées.

---

## 5. Photos

Le site est conçu pour être beau **sans aucune photo**. Quand une photo est absente, son emplacement disparaît simplement, sans cadre vide.

Pour en ajouter :

1. Déposez les originaux (JPG ou PNG) dans `photos/` à la racine du projet.
2. Convertissez-les. ImageMagick est requis (`brew install imagemagick` ou `sudo apt install imagemagick`).

   ```bash
   tools/optimize-photos.sh
   ```

   Le script crée des fichiers WebP en 480, 960, 1600 et 2400 px de large dans `site/assets/photos/`. Il conserve les **proportions d'origine** (aucun recadrage) et supprime les métadonnées, y compris la position GPS. Il affiche le **nom** de chaque photo, par exemple `charlene-julien-1`.
3. Dans `site/content.php` › `photos`, indiquez ce nom et une courte description (lue par les lecteurs d'écran) :

   ```php
   'accueil' => ['fichier' => 'charlene-julien-1', 'description' => 'Charlène et Julien dans les vignes'],
   ```

   Trois emplacements sont disponibles :
   - `accueil` : en grand sur la page d'accueil. Sur grand écran, à côté des prénoms ; sur mobile, en dessous.
   - `apres_programme` : entre le Programme et l'Accès.
   - `apres_infos` : entre les Infos pratiques et le RSVP.
4. Déposez `site/assets/photos/` et `content.php` sur le serveur.

Les photos sont chargées en différé, sauf celle de l'accueil, et le navigateur choisit la taille adaptée à l'écran (`srcset`).

---

## 6. Qualité et vérifications effectuées

Les tests ont été faits en local, avec le serveur PHP intégré et un faux serveur SMTP.

**Rendu**
- Pages vérifiées à 360, 768 et 1440 px de large, sans défilement horizontal.
- Menu burger sur mobile vérifié.
- Mise en page sans photo, puis avec une photo de test.

**Formulaire RSVP**
- Validation des champs (messages en français à côté de chaque champ, focus placé sur le premier champ en erreur).
- Affichage des questions selon la présence, le transport et le covoiturage. La date de départ ne peut pas précéder la date d'arrivée.
- Envoi avec et sans JavaScript.
- Les deux e-mails sont envoyés et reçus. Le HTML saisi est bien échappé.
- Champ piège, jeton CSRF falsifié, origine tierce, limite d'envois et limite d'essais de mot de passe.

**Lighthouse, mobile**

| Page | Performance | Accessibilité | Bonnes pratiques | SEO |
|---|---|---|---|---|
| Page d'entrée | 100 | 100 | 100 | 63* |
| Site (connecté) | 99 | 100 | 100 | 63* |

\* Le score SEO est **volontairement** pénalisé par l'interdiction d'indexation (`noindex` et `robots.txt`) que vous avez demandée. Tous les autres critères SEO sont validés.

En local, Lighthouse signale aussi le cache et la compression : sur Infomaniak, c'est le `.htaccess` (`mod_deflate`, `Cache-Control`) qui s'en charge.

---

## Licences

- **Bebas Neue** et **Inter** : SIL Open Font License 1.1 (`site/assets/fonts/OFL-*.txt`).
- **PHPMailer** : LGPL 2.1 (`site/lib/PHPMailer/LICENSE`).
