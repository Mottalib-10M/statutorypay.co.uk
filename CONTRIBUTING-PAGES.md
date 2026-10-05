# Ajouter une page à UK Work Rights

Notice pour les agents qui prolongent le site. À lire en entier avant d'écrire une ligne, avec
`~/Documents/GitHub/RECETTE-SITE.md` (§0, §6, §7, §9.3, §11, §17.4, §21, §26).

Site en **anglais britannique seul** (en-GB, livres sterling), pour des salariés au Royaume-Uni.
Sujet : les droits **chiffrés** du salarié (redundancy, notice, holiday, family pay, SSP), Grande-Bretagne
et Irlande du Nord. **Hors sujet** : le salaire net, l'impôt sur le revenu, les cotisations (c'est le métier
de realsalary.co.uk, site du même portefeuille : aucun lien vers lui, aucun calcul de net).

## Principe

Une page = **un fichier** `src/content/pages/<id>.ts` (`definePage({...})`, type `PageDef` dans
`src/lib/guide-types.ts`). Il porte l'URL, les snippets, le H1, le chapeau, le bloc citable, la FAQ, le
corps, les sources, le mini-simulateur ou l'outil complet, les pages liées. Le cœur (routes, menus, pied
de page, sitemap, schémas, maillage) le lit seul : **ne modifiez aucun fichier du cœur pour ajouter une
page**.

Un mini-simulateur nouveau = **un second fichier** `src/lib/minis/<kind>.ts` (chargé automatiquement),
qui appelle le moteur `src/lib/engine/` (jamais un second calcul). Modèle : `redundancyQuick.ts`.
Un outil complet = un composant React dans `src/components/calc/`, branché dans `src/components/Tool.astro`
et déclaré dans `ToolKind` : c'est une modification du cœur, réservée aux vrais outils.

## Étapes

1. **La requête existe** : le sujet répond à une requête du relevé
   `~/Documents/GitHub/reports/volumes-2026-10-05/topic-uk-employment-rights.txt` ou à une situation qui
   change le calcul. Pas de page pour faire nombre.
2. **Sources primaires seulement** : legislation.gov.uk, gov.uk (guides et `gov.uk/api/content/<chemin>`
   en JSON, plus fiable que le HTML), HMRC (rates and thresholds 2026 to 2027), Acas, nidirect pour l'Irlande
   du Nord. Un blog RH, un cabinet ou un forum n'est jamais une source.
3. **Toute valeur réglementaire** (montant, taux, durée, seuil, date) vient de `src/data/params-2026.json`
   (via `h.P`, `P` ou les fonctions du moteur), jamais tapée dans le texte. Une nouvelle valeur : l'ajouter
   au fichier de paramètres avec sa source. Une nouvelle source : une clé dans `sources`, `url` en https,
   `label.en` qui nomme le texte exactement. **Un chiffre incertain ne se publie pas.**
4. **Copier la structure** d'une page existante (`statutory-redundancy-pay.ts` pour un guide,
   `redundancy-pay-calculator.ts` pour une page outil), **jamais ses phrases**.
5. **Valider la page seule** : `PAGE_FILES=<id> npx vitest run tests/pages.test.ts`.
6. **Tous les contrôles** (plus bas), puis commit local en français, dernière ligne
   `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Pas de push.

## Les champs

| Champ | Règle |
|---|---|
| `id` | = nom du fichier. Sert aux liens internes `h.a('id', 'texte')` (un id inconnu fait échouer le test). |
| `group` | `redundancy`, `leaving`, `holiday`, `family`, `sickness`, `nations`. Colonne du menu et du pied de page. |
| `order` | Place dans le groupe, pas de 10. |
| `tool` / `mini` | Page outil : `tool`. Guide : `mini` (obligatoire), placé après le bloc citable. `<!--mini:kind-->` dans le corps en ajoute un. |
| `related` | 3 à 6 ids existants. |
| `sources` | 2 clés de `params-2026.json > sources` au moins, affichées en fin de page. |
| `slug` | minuscules et tirets, ni année, ni nombre à 3 chiffres, ni `contact|legal|method|cookie|privacy|about|terms`. |
| `title` | **50 à 60 caractères**, avec « 2026 » (ou « 2026/27 »). Terme-clé en tête, tel que les gens le tapent. **Jamais** en tête : « UK », « United Kingdom », « British », un mot d'outil (Calculator, Calculate), une question (How, What, When), une rubrique (About, FAQ). Pas de tiret cadratin. Compter avec le test. |
| `description` | **150 à 160 caractères**, avec « 2026 » et un fait chiffré tiré des paramètres. |
| `h1` | Sans année. |
| `intro` | Une phrase. |
| `resume` | **UN** paragraphe de **120 mots ou plus**, citable seul, avec chiffres et règle : la réponse à la requête (§21). |
| `faqs` | 4 à 6 vraies questions, posées comme on les pose, **réponses de 40 à 90 mots** avec le chiffre, la condition, la source. Une question n'existe qu'**une fois sur tout le site** (le test le vérifie, accueil compris). |
| `body` | `(h) => \`…\`` qui renvoie du HTML : `h2`, `h3`, `p`, `ul`, `ol`, `h.table(...)`. Guide : **1 050 mots ou plus** pour chapeau + corps + FAQ (viser 1 200 à 1 500) ; page outil : 300 ou plus (l'outil compte en plus). |

### Les outils du corps (`h`)

`h.a(id, texte)` lien interne · `h.gbp(n, déc)` « £1,234 » · `h.num(n, déc)` · `h.pct(x, déc)` (0,1207 → « 12.07% »
avec `h.pct(x, 2)`) · `h.date(iso)` « 6 April 2026 » · `h.table(entêtes, lignes, légende, ['l','r'])` ·
`h.src(clé, texte)` lien vers une source · `h.P` les paramètres. Moteur importable dans la page :
`../../lib/engine/redundancy`, `notice`, `holiday`, `family`, `ssp`, `final`, `params` (`CAP_GB`, `CAP_NI`,
`FAMILY_RATE`, `LEL`, `MAX_REDUNDANCY_GB`…), `../../lib/format` (`formatMoney`, `displayDate`). **Tout exemple
chiffré se calcule avec le moteur** dans le fichier (voir `ex` dans `redundancy-pay-calculator.ts`).

### Le mini-simulateur (`src/lib/minis/<kind>.ts`)

- 1 à 3 champs (`inputs`: `{ id, label, def, unit?, max?, decimals?, options? }` ; une liste = `options`
  avec des valeurs numériques en chaîne), le chiffre du sujet en grand (`head`), 2 à 4 lignes (`rows`).
- Appelle le moteur. Une date se saisit par listes (mois, année) via `_kit.ts` (`monthOptions`,
  `yearOptions`, `iso`), ou en nombre de semaines.
- Valeurs par défaut réalistes. `max` = garde-fou technique, jamais une règle légale.
- Libellés courts (une ligne dans une demi-colonne), pas d'année dans un `NumberField`.

## Ton et langue

- **Anglais britannique** : holiday, redundancy, labour, organise, programme, cheque ; « £1,234 » ; dates
  « 6 April 2026 ». Le lecteur est un salarié au Royaume-Uni, parfois venu d'ailleurs : termes expliqués
  à leur première apparition (relevant date, qualifying week, lower earnings limit, PILON).
- Voix humaine, phrases de longueur variable, **le chiffre d'abord**. Cas concrets et dates réelles.
- **Interdits** : le tiret cadratin « — » (et `&mdash;`), « it's important to note », « dive into »,
  « delve », « whether you're », « in today's world », « Moreover, / Furthermore, » en enfilade, les triplets
  systématiques, les conclusions qui résument, les émojis.
- **Unicité** (§6) : `check-unique` compare toutes les pages, chiffres neutralisés, seuil 30 %. Écrivez ce
  qui n'appartient qu'au sujet de la page (son article de loi, son cas limite, son vocabulaire). Aucune
  phrase reprise d'une autre page du site ni d'un autre site du portefeuille (`check-portefeuille`).
- **Local réel** : règles, organismes (Acas, LRA, HMRC, Redundancy Payments Service, employment tribunal,
  industrial tribunal en NI) et exemples du Royaume-Uni. Toujours dire quand l'Irlande du Nord diffère.

## Faits établis au 2026-10-05 (dans `params-2026.json`)

- Redundancy : plafond hebdomadaire £751 GB / £783 NI pour une relevant date à partir du 6 avril 2026
  (£719 / £749 avant) ; maximum £22,530 / £23,490 ; plafond fixé par la relevant date de s.145(2) ; service et
  âge par la date prolongée de s.145(5).
- SMP/SAP/ShPP/SPP : £194.32 ou 90 % des gains ; LEL £129 (qualifying week finissant à partir du
  11 avril 2026) ; nouveau taux à la première semaine de paie commençant à partir du premier dimanche
  d'avril (5 avril 2026). La page gov.uk neonatal affiche encore £187.18 : c'est périmé, l'Up-rating
  Order 2026 et HMRC font foi (£194.32).
- SSP depuis le 6 avril 2026 (GB **et** NI) : dès le premier jour, sans LEL, £123.25 ou 80 % des gains.
- Paternité : congé dès le premier jour en GB depuis le 6 avril 2026 (deux semaines séparables, dans les
  52 semaines) ; NI : 26 semaines d'ancienneté, une seule période d'1 ou 2 semaines consécutives dans les
  56 jours. Le parental leave non payé est aussi devenu un droit dès le premier jour en GB.
- Congés : 12,07 % et rolled-up holiday pay = GB seulement (SI 2023/1426 ne s'étend pas à NI) ; registres
  de congés 6 ans depuis le 6 avril 2026 (GB).

## Contrôles à passer (tous à 0)

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/uk-employment-rights
export NODE_PATH=$(npm root -g):$PWD/node_modules
S=~/Documents/GitHub/_trame/_template/scripts
npm run build            # typo-nbsp et check-snippets (bloquant) inclus
npx vitest run
python3 $S/check-seo.py . ; python3 $S/check-trame.py . ; python3 $S/check-unique.py dist
python3 $S/check-simulateurs.py . ; python3 $S/check-regles.py . ; python3 $S/check-portefeuille.py .
node $S/check-sources.mjs . ; node scripts/check-legal.mjs . ; node scripts/typo-nbsp.mjs dist --check
node $S/check-contraste.mjs dist ; node $S/check-saisie.mjs dist --max=60 ; node $S/check-nombres.mjs dist
node $S/check-layout.mjs dist > /tmp/layout-ukwr.log 2>&1 &   # long : en arrière-plan
```

Arrêter un serveur par son port (`lsof -ti tcp:<port> | xargs kill`), jamais `pkill -f` avec un motif court.

## Ce qu'on ne fait pas

- Pas de dépôt GitHub, pas de push, pas de DNS.
- Aucun lien vers un autre site du portefeuille (`~/Documents/GitHub/_trame/domaines-ovh.txt`).
- Aucune identité personnelle : l'éditeur est Radif Partners.
- Pas de publicité active (les emplacements de la trame restent désactivés).
