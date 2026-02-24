export const metadata = {
  title: 'Politique de confidentialité – Mango',
  description: 'Politique de confidentialité de Mango (sn.mango.dating)',
};

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px', fontFamily: 'sans-serif', color: '#111', lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Politique de confidentialité</h1>
      <p style={{ color: '#555', marginBottom: 32 }}>Dernière mise à jour : février 2026 · Mango (sn.mango.dating)</p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32 }}>1. Données collectées</h2>
      <p>Mango collecte les données suivantes lors de l'inscription et de l'utilisation :</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>Adresse e-mail et mot de passe (via Firebase Authentication)</li>
        <li>Informations de profil : prénom, âge, ville, bio, centres d'intérêt, photos</li>
        <li>Données de localisation approximative (avec votre consentement)</li>
        <li>Messages échangés avec d'autres utilisateurs</li>
        <li>Messages vocaux envoyés dans l'application</li>
      </ul>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32 }}>2. Utilisation des données</h2>
      <p>Vos données sont utilisées pour :</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>Afficher votre profil aux autres utilisateurs compatibles</li>
        <li>Calculer la distance entre utilisateurs (localisation)</li>
        <li>Permettre la communication entre utilisateurs matchés</li>
        <li>Améliorer l'expérience de l'application</li>
      </ul>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32 }}>3. Partage des données</h2>
      <p>
        Mango ne vend pas vos données personnelles. Vos données sont stockées sur les serveurs Firebase (Google Cloud) et ne sont partagées avec aucun tiers à des fins commerciales.
      </p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32 }}>4. Localisation</h2>
      <p>
        L'accès à votre position est demandé uniquement pour afficher la distance approximative avec d'autres utilisateurs. Vous pouvez refuser cette permission sans impact sur les autres fonctionnalités.
      </p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32 }}>5. Conservation des données</h2>
      <p>
        Vos données sont conservées tant que votre compte est actif. Vous pouvez demander la suppression de votre compte et de toutes vos données en nous contactant.
      </p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32 }}>6. Sécurité</h2>
      <p>
        Nous utilisons Firebase (Google) pour le stockage et l'authentification, bénéficiant de l'infrastructure de sécurité de Google Cloud.
      </p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32 }}>7. Mineurs</h2>
      <p>
        Mango est réservé aux personnes âgées de 18 ans et plus. Nous ne collectons pas sciemment de données sur des mineurs.
      </p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32 }}>8. Vos droits</h2>
      <p>Vous pouvez à tout moment :</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>Accéder à vos données personnelles</li>
        <li>Modifier ou supprimer votre profil</li>
        <li>Demander la suppression complète de votre compte</li>
      </ul>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32 }}>9. Contact</h2>
      <p>
        Pour toute question relative à vos données personnelles :{' '}
        <a href="mailto:vianney@dunesignature.com" style={{ color: '#E87000' }}>vianney@dunesignature.com</a>
      </p>
    </main>
  );
}
