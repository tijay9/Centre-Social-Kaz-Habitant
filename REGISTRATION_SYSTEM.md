# Système d'Inscription aux Événements avec Validation Email

## 📋 Vue d'ensemble

Ce système permet aux utilisateurs de s'inscrire à des événements avec une validation par email en deux étapes :
1. **Confirmation email par l'utilisateur**
2. **Approbation par l'administrateur**

## 🔄 Flux d'inscription

### Étape 1 : Demande d'inscription
```
Utilisateur remplit le formulaire → API crée l'inscription (statut: PENDING) → Email de confirmation envoyé
```

### Étape 2 : Confirmation email
```
Utilisateur clique sur le lien → Statut passe à EMAIL_CONFIRMED → Email envoyé à l'admin
```

### Étape 3 : Approbation admin
```
Admin approuve → Statut passe à CONFIRMED → Email de confirmation finale envoyé à l'utilisateur
```

## 📧 Emails automatiques

### 1. Email de confirmation à l'utilisateur
- **Quand** : Dès la demande d'inscription
- **Contenu** : Lien de confirmation (valide 24h)
- **Template** : `getUserConfirmationEmail()`

### 2. Email de notification à l'admin
- **Quand** : Après confirmation email par l'utilisateur
- **Contenu** : Détails du participant + lien vers l'interface admin
- **Template** : `getAdminNotificationEmail()`

### 3. Email de confirmation finale
- **Quand** : Après approbation par l'admin
- **Contenu** : Récapitulatif complet de l'événement
- **Template** : `getFinalConfirmationEmail()`

## 🛠️ Configuration

### Variables d'environnement requises

```env
# Brevo API


# URL de base (pour les liens de confirmation)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🗄️ Structure de la base de données

### Nouveaux champs dans `registrations`

| Champ | Type | Description |
|-------|------|-------------|
| `status` | ENUM | PENDING, EMAIL_CONFIRMED, CONFIRMED, CANCELLED |
| `emailToken` | VARCHAR(255) | Token unique de validation |
| `emailTokenExpiry` | DATETIME | Date d'expiration du token (24h) |
| `emailConfirmedAt` | DATETIME | Date de confirmation email |
| `adminApprovedAt` | DATETIME | Date d'approbation admin |
| `adminApprovedBy` | VARCHAR(64) | ID de l'admin qui a approuvé |

### Migration de la base de données

```bash
# Exécuter le script de migration
mysql -u votre_user -p votre_database < scripts/migrate-registrations.sql
```

## 🔌 API Endpoints

### POST `/api/registrations`
Créer une nouvelle inscription et envoyer l'email de confirmation.

**Body:**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "0696123456",
  "message": "Message optionnel",
  "eventId": "event_123"
}
```

**Response (201):**
```json
{
  "message": "Inscription créée avec succès. Veuillez vérifier votre email...",
  "registration": {
    "id": "reg_xxx",
    "email": "jean.dupont@example.com",
    "status": "PENDING"
  }
}
```

### GET `/api/registrations/confirm-email?token={token}`
Confirmer l'email de l'utilisateur via le token.

**Comportement:**
- Vérifie la validité du token
- Met à jour le statut à `EMAIL_CONFIRMED`
- Envoie une notification à l'admin
- Redirige vers la page des événements avec un message de succès

### PATCH `/api/registrations/{id}`
Approuver ou rejeter une inscription (admin uniquement).

**Body pour approuver:**
```json
{
  "action": "approve"
}
```

**Body pour rejeter:**
```json
{
  "action": "reject"
}
```

## 🎨 Statuts des inscriptions

### PENDING (En attente)
- 🟡 Jaune
- Inscription créée, email non confirmé

### EMAIL_CONFIRMED (Email confirmé)
- 🔵 Bleu
- Email confirmé, en attente d'approbation admin

### CONFIRMED (Confirmée)
- 🟢 Vert
- Approuvée par l'admin, inscription complète

### CANCELLED (Annulée)
- 🔴 Rouge
- Rejetée ou annulée

## 📝 Utilisation dans l'interface admin

### Approuver une inscription

```typescript
// Dans le composant admin
const handleApprove = async (registrationId: string) => {
  const response = await fetch(`/api/registrations/${registrationId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'approve' })
  });
  
  if (response.ok) {
    // Inscription approuvée, email envoyé à l'utilisateur
  }
};
```

## 🔒 Sécurité

- ✅ Tokens uniques générés avec `crypto.randomBytes(32)`
- ✅ Expiration automatique des tokens après 24h
- ✅ Vérification de l'authentification admin pour l'approbation
- ✅ Prévention des inscriptions en double
- ✅ Validation des données côté serveur

## 🧪 Tests

### Test du flux complet

1. **Créer une inscription**
```bash
curl -X POST http://localhost:3000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "0696000000",
    "eventId": "event_id"
  }'
```

2. **Vérifier l'email reçu et cliquer sur le lien de confirmation**

3. **Vérifier que l'admin reçoit la notification**

4. **Se connecter en tant qu'admin et approuver l'inscription**

5. **Vérifier que l'utilisateur reçoit l'email de confirmation finale**

## 📚 Fichiers principaux

- `src/lib/brevo-email.ts` - Service d'envoi d'emails avec templates
- `src/app/api/registrations/route.ts` - Création d'inscription
- `src/app/api/registrations/confirm-email/route.ts` - Confirmation email
- `src/app/api/registrations/[id]/route.ts` - Approbation admin
- `scripts/migrate-registrations.sql` - Migration de la base de données
- `src/types/sib-api-v3-sdk.d.ts` - Types TypeScript pour Brevo

## 🚀 Déploiement

Avant de déployer en production :

1. ✅ Configurer  dans les variables d'environnement
2. ✅ Configurer `NEXT_PUBLIC_BASE_URL` avec l'URL de production
3. ✅ Exécuter la migration SQL sur la base de données de production
4. ✅ Tester le flux complet avec un email réel
5. ✅ Vérifier que l'email admin est correctement configuré dans la table `users`

## 🆘 Dépannage

### L'email de confirmation n'est pas envoyé
- Vérifier que `` est correctement configurée
- Vérifier les logs de l'API Brevo
- Tester avec l'email configuré dans Brevo

### Le lien de confirmation ne fonctionne pas
- Vérifier que `NEXT_PUBLIC_BASE_URL` est correct
- Vérifier que le token n'a pas expiré (24h)
- Vérifier les logs dans la console

### L'admin ne reçoit pas la notification
- Vérifier qu'un utilisateur avec `role='ADMIN'` et `active=1` existe
- Vérifier l'adresse email de l'admin dans la base de données
- Vérifier les logs d'envoi d'email

## 📞 Support

Pour toute question ou problème :
- Email : associationdorothy@live.fr
- Téléphone : 0696 00 01 69 / 0696 61 36 03
