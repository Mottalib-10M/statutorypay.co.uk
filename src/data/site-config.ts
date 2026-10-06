/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://statutorypay.co.uk";
export const SITE_NAMES: Record<string, string> = {"en": "Statutory Pay"};
export const LANG_TAGS: Record<string, string> = {"en": "en-GB"};
export const OG_LOCALES: Record<string, string> = {"en": "en_GB"};
export const LOCALE_TAG = 'en-GB';
export const CURRENCY = 'GBP';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-05';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"en": "Publisher of the Statutory Pay calculators"};
export const AUTHOR_DESC: Record<string, string> = {"en": "Radif Partners publishes free calculators that apply the statutory minimums of UK employment law to real dates: redundancy pay with the cap in force on the relevant date, notice, holiday entitlement and holiday pay, maternity, paternity, shared parental and adoption pay, and Statutory Sick Pay under the April 2026 rules, for Great Britain and Northern Ireland, each figure read in the legislation, HMRC tables, GOV.UK, Acas or nidirect."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"en": ["Statutory redundancy pay", "Notice periods", "Annual leave and holiday pay", "Statutory Maternity Pay", "Statutory Paternity Pay", "Shared Parental Pay", "Statutory Adoption Pay", "Statutory Sick Pay", "Employment Rights Act 1996", "Working Time Regulations 1998", "Employment rights in Northern Ireland"]};
export const CONTACT_EMAIL = "contact@statutorypay.co.uk";
export const THEME_COLOR = '#012169';
export const LOGO_SYMBOL = '§';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime de consentement : 'opt-in' = rien avant l'accord (UE, Suisse) ;
 *  'notice' = mesure d'audience active avec information préalable et retrait (CA, AU). */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'opt-in';
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif). Vide = aucun traceur ni bandeau. */
export const CLARITY_ID = 'ytm5v2hzlj';
export const INDEXNOW_KEY = '3305aaa79faf2e9399e6c89be5476dec';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // publisher of every site of the portfolio (RECETTE §8)
  legalForm: '',
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "France",
  phone: '',
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "VAT",
  vatNumber: '',
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
