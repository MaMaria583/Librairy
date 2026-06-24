# Guide de configuration — WhatsApp Business Cloud API

## Prérequis
- Compte Facebook / Meta
- Numéro de téléphone dédié (pas déjà sur WhatsApp personnel)
- Site déployé sur Vercel (URL publique HTTPS)

---

## Étape 1 — Créer une app Meta Developer

1. Aller sur https://developers.facebook.com
2. **Mes Apps → Créer une app**
3. Type : **Business**
4. Nom : `DAR ELHIKMA`
5. Ajouter le produit **WhatsApp**

---

## Étape 2 — Configurer le numéro de téléphone

1. **WhatsApp → Démarrage**
2. Sélectionner ou ajouter votre numéro `+22394664694`
3. Vérifier le numéro par SMS/appel
4. Copier le **Phone Number ID** → coller dans `.env` :
   ```
   WHATSAPP_PHONE_NUMBER_ID=1234567890123456
   ```

---

## Étape 3 — Générer le token d'accès permanent

1. **Meta Business Suite → Paramètres système → Utilisateurs système**
2. Créer un utilisateur système → rôle **Administrateur**
3. **Générer un token** → sélectionner votre app
4. Permissions requises : `whatsapp_business_messaging`, `whatsapp_business_management`
5. Copier le token → `.env` :
   ```
   WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

## Étape 4 — Configurer le webhook

1. **WhatsApp → Configuration → Webhooks**
2. URL de rappel :
   ```
   https://VOTRE_DOMAINE_VERCEL.vercel.app/api/whatsapp/webhook
   ```
3. Token de vérification : copier exactement la valeur de votre `.env` :
   ```
   WHATSAPP_VERIFY_TOKEN=darelhikma_webhook_2024
   ```
4. Cliquer **Vérifier et enregistrer**
5. **S'abonner** au champ : `messages`

---

## Étape 5 — Ajouter les variables sur Vercel

Dans Vercel Dashboard → Settings → Environment Variables :

| Variable | Valeur |
|---|---|
| `WHATSAPP_VERIFY_TOKEN` | `darelhikma_webhook_2024` |
| `WHATSAPP_ACCESS_TOKEN` | Votre token permanent |
| `WHATSAPP_PHONE_NUMBER_ID` | Votre Phone Number ID |

Puis **Redéployer** le projet.

---

## Test rapide

Envoyez ce message depuis n'importe quel numéro à `+22394664694` :

```
Bonjour, avez-vous des livres sur l'entrepreneuriat ?
```

L'agent IA doit répondre automatiquement dans les 3 secondes.

---

## Flux automatisé complet

```
Client → WhatsApp message avec réf. commande
         ↓
    Agent détecte "Réf. commande : [ID]"
         ↓
    Répond : "Commande validée ! Envoyez [TOTAL] FCFA au +22394664694..."
         ↓
Client envoie capture de paiement (image) ou numéro de transaction
         ↓
    Agent confirme → DB : Order.status = PAID + stock décrémenté
         ↓
    Répond : "Transaction reçue ! 🎉"
    Après 2.5s : "Le livreur vous contactera dans peu de temps 🚚"
         ↓
    Email de notification → mariammariadembele@gmail.com
```
