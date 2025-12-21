# API Consultations - Documentation Client

## Vue d'ensemble
Cette documentation décrit toutes les API disponibles pour les clients (CLIENT) pour gérer leurs consultations avec les agents de voyage.

**Base URL**: `/consultations`

**Authentication**: Toutes les routes nécessitent un token JWT Bearer dans le header `Authorization: Bearer <token>`

**Role requis**: `CLIENT`

**Language**: Toutes les réponses d'erreur sont traduites selon le header `Accept-Language` (fr/en)

---

## 📋 Table des matières
1. [Récupérer mes consultations](#1-récupérer-mes-consultations)
2. [Récupérer une consultation spécifique](#2-récupérer-une-consultation-spécifique)
3. [Modifier une consultation](#3-modifier-une-consultation)
4. [Supprimer une consultation](#4-supprimer-une-consultation)
5. [Annuler une consultation](#5-annuler-une-consultation)
6. [Structures de données](#structures-de-données)
7. [Codes d'erreur](#codes-derreur)

---

## 1. Récupérer mes consultations

### Endpoint
```
GET /consultations/my-consultations
```

### Description
Récupère la liste de toutes les consultations du client connecté.

### Headers
```
Authorization: Bearer <votre_token_jwt>
Accept-Language: fr
```

### Paramètres
Aucun paramètre requis.

### Réponse Succès (200 OK)
```json
{
  "isSuccess": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "customerId": "123e4567-e89b-12d3-a456-426614174000",
      "agentId": null,
      "subject": "Demande d'information sur les forfaits",
      "description": "Je souhaite obtenir des informations détaillées sur vos forfaits",
      "consultationDate": "2024-07-20T10:00:00.000Z",
      "duration": 30,
      "status": "PENDING",
      "cancelledAt": null,
      "createdAt": "2024-07-15T08:30:00.000Z",
      "updatedAt": "2024-07-15T08:30:00.000Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "customerId": "123e4567-e89b-12d3-a456-426614174000",
      "agentId": "789e4567-e89b-12d3-a456-426614174002",
      "subject": "Consultation pour voyage en Grèce",
      "description": "Planification d'un voyage de 2 semaines",
      "consultationDate": "2024-07-25T14:00:00.000Z",
      "duration": 60,
      "status": "CONFIRMED",
      "cancelledAt": null,
      "createdAt": "2024-07-16T10:00:00.000Z",
      "updatedAt": "2024-07-17T09:15:00.000Z"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 10
}
```

### Exemple de requête (JavaScript/Fetch)
```javascript
const response = await fetch('https://votre-api.com/consultations/my-consultations', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer votre_token_jwt',
    'Accept-Language': 'fr',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

### Exemple de requête (Axios)
```javascript
import axios from 'axios';

const response = await axios.get('https://votre-api.com/consultations/my-consultations', {
  headers: {
    'Authorization': 'Bearer votre_token_jwt',
    'Accept-Language': 'fr'
  }
});

console.log(response.data);
```

---

## 2. Récupérer une consultation spécifique

### Endpoint
```
GET /consultations/my-consultations/:id
```

### Description
Récupère les détails complets d'une consultation spécifique appartenant au client connecté.

### Headers
```
Authorization: Bearer <votre_token_jwt>
Accept-Language: fr
```

### Paramètres URL
- `id` (string, requis) - L'identifiant UUID de la consultation

### Réponse Succès (200 OK)
```json
{
  "isSuccess": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "agentId": "789e4567-e89b-12d3-a456-426614174002",
    "subject": "Demande d'information sur les forfaits",
    "description": "Je souhaite obtenir des informations détaillées sur vos forfaits",
    "consultationDate": "2024-07-20T10:00:00.000Z",
    "duration": 30,
    "status": "CONFIRMED",
    "cancelledAt": null,
    "createdAt": "2024-07-15T08:30:00.000Z",
    "updatedAt": "2024-07-15T08:30:00.000Z",
    "customer": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "user-123",
      "phone": "+33612345678",
      "user": {
        "email": "client@example.com",
        "firstName": "Jean",
        "lastName": "Dupont"
      }
    },
    "agent": {
      "id": "789e4567-e89b-12d3-a456-426614174002",
      "userId": "agent-789",
      "phone": "+33698765432",
      "specialty": "Voyages en Europe",
      "user": {
        "email": "agent@example.com",
        "firstName": "Marie",
        "lastName": "Martin"
      }
    }
  }
}
```

### Réponses d'erreur

#### 404 Not Found - Consultation non trouvée
```json
{
  "isError": true,
  "error": "CONSULTATION_NOT_FOUND",
  "message": "La consultation demandée n'existe pas"
}
```

#### 403 Forbidden - Accès non autorisé
```json
{
  "isError": true,
  "error": "UNAUTHORIZED_ACCESS",
  "message": "Vous n'avez pas accès à cette consultation"
}
```

### Exemple de requête (JavaScript/Fetch)
```javascript
const consultationId = '550e8400-e29b-41d4-a716-446655440000';

const response = await fetch(`https://votre-api.com/consultations/my-consultations/${consultationId}`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer votre_token_jwt',
    'Accept-Language': 'fr',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

---

## 3. Modifier une consultation

### Endpoint
```
PATCH /consultations/my-consultations/:id
```

### Description
Permet au client de modifier une consultation existante (uniquement les consultations en statut PENDING ou CONFIRMED).

### Headers
```
Authorization: Bearer <votre_token_jwt>
Accept-Language: fr
Content-Type: application/json
```

### Paramètres URL
- `id` (string, requis) - L'identifiant UUID de la consultation

### Corps de la requête (Body)
Tous les champs sont optionnels. Envoyez uniquement les champs que vous souhaitez modifier.

```typescript
{
  subject?: string;           // Sujet de la consultation
  description?: string;       // Description détaillée (optionnel)
  consultationDate?: string;  // Date et heure au format ISO 8601
  duration?: number;          // Durée en minutes (minimum 15)
}
```

### Exemple de Body
```json
{
  "subject": "Nouveau sujet - Voyage en Italie",
  "description": "Je voudrais des informations sur Rome et Florence",
  "consultationDate": "2024-07-22T15:00:00.000Z",
  "duration": 45
}
```

### Réponse Succès (200 OK)
```json
{
  "isSuccess": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "agentId": null,
    "subject": "Nouveau sujet - Voyage en Italie",
    "description": "Je voudrais des informations sur Rome et Florence",
    "consultationDate": "2024-07-22T15:00:00.000Z",
    "duration": 45,
    "status": "PENDING",
    "cancelledAt": null,
    "createdAt": "2024-07-15T08:30:00.000Z",
    "updatedAt": "2024-07-18T14:20:00.000Z"
  }
}
```

### Réponses d'erreur

#### 404 Not Found
```json
{
  "isError": true,
  "error": "CONSULTATION_NOT_FOUND",
  "message": "La consultation demandée n'existe pas"
}
```

#### 403 Forbidden
```json
{
  "isError": true,
  "error": "UNAUTHORIZED_ACCESS",
  "message": "Vous n'avez pas accès à cette consultation"
}
```

#### 400 Bad Request - Statut invalide
```json
{
  "isError": true,
  "error": "INVALID_CONSULTATION_STATUS",
  "message": "Impossible de modifier une consultation avec ce statut"
}
```

#### 400 Bad Request - Date dans le passé
```json
{
  "isError": true,
  "error": "CONSULTATION_DATE_IN_PAST",
  "message": "La date de consultation doit être dans le futur"
}
```

#### 400 Bad Request - Créneau non disponible
```json
{
  "isError": true,
  "error": "TIME_SLOT_NOT_AVAILABLE",
  "message": "Le créneau horaire sélectionné n'est pas disponible"
}
```

### Exemple de requête (JavaScript/Fetch)
```javascript
const consultationId = '550e8400-e29b-41d4-a716-446655440000';

const updateData = {
  subject: "Nouveau sujet - Voyage en Italie",
  description: "Je voudrais des informations sur Rome et Florence",
  consultationDate: "2024-07-22T15:00:00.000Z",
  duration: 45
};

const response = await fetch(`https://votre-api.com/consultations/my-consultations/${consultationId}`, {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer votre_token_jwt',
    'Accept-Language': 'fr',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(updateData)
});

const data = await response.json();
console.log(data);
```

### Exemple de requête (Axios)
```javascript
import axios from 'axios';

const consultationId = '550e8400-e29b-41d4-a716-446655440000';

const updateData = {
  subject: "Nouveau sujet - Voyage en Italie",
  consultationDate: "2024-07-22T15:00:00.000Z"
};

const response = await axios.patch(
  `https://votre-api.com/consultations/my-consultations/${consultationId}`,
  updateData,
  {
    headers: {
      'Authorization': 'Bearer votre_token_jwt',
      'Accept-Language': 'fr'
    }
  }
);

console.log(response.data);
```

---

## 4. Supprimer une consultation

### Endpoint
```
DELETE /consultations/my-consultations/:id
```

### Description
Supprime définitivement une consultation. Cette action est irréversible.

### Headers
```
Authorization: Bearer <votre_token_jwt>
Accept-Language: fr
```

### Paramètres URL
- `id` (string, requis) - L'identifiant UUID de la consultation

### Réponse Succès (200 OK)
```json
{
  "isSuccess": true,
  "message": "Consultation supprimée avec succès"
}
```

### Réponses d'erreur

#### 404 Not Found
```json
{
  "isError": true,
  "error": "CONSULTATION_NOT_FOUND",
  "message": "La consultation demandée n'existe pas"
}
```

#### 403 Forbidden
```json
{
  "isError": true,
  "error": "UNAUTHORIZED_ACCESS",
  "message": "Vous n'avez pas accès à cette consultation"
}
```

#### 400 Bad Request - Impossible d'annuler
```json
{
  "isError": true,
  "error": "CANNOT_CANCEL_CONSULTATION",
  "message": "Impossible de supprimer cette consultation"
}
```

### Exemple de requête (JavaScript/Fetch)
```javascript
const consultationId = '550e8400-e29b-41d4-a716-446655440000';

const response = await fetch(`https://votre-api.com/consultations/my-consultations/${consultationId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer votre_token_jwt',
    'Accept-Language': 'fr',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

---

## 5. Annuler une consultation

### Endpoint
```
PATCH /consultations/my-consultations/:id/cancel
```

### Description
Annule une consultation existante avec une raison obligatoire. La consultation passe au statut CANCELLED.

### Headers
```
Authorization: Bearer <votre_token_jwt>
Accept-Language: fr
Content-Type: application/json
```

### Paramètres URL
- `id` (string, requis) - L'identifiant UUID de la consultation

### Corps de la requête (Body)
```typescript
{
  cancellationReason: string;  // Raison de l'annulation (requis)
}
```

### Exemple de Body
```json
{
  "cancellationReason": "Changement de plans - Je dois reporter mon voyage"
}
```

### Réponse Succès (200 OK)
```json
{
  "isSuccess": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "agentId": "789e4567-e89b-12d3-a456-426614174002",
    "subject": "Demande d'information sur les forfaits",
    "description": "Je souhaite obtenir des informations détaillées",
    "consultationDate": "2024-07-20T10:00:00.000Z",
    "duration": 30,
    "status": "CANCELLED",
    "cancelledAt": "2024-07-18T16:45:00.000Z",
    "createdAt": "2024-07-15T08:30:00.000Z",
    "updatedAt": "2024-07-18T16:45:00.000Z"
  }
}
```

### Réponses d'erreur

#### 404 Not Found
```json
{
  "isError": true,
  "error": "CONSULTATION_NOT_FOUND",
  "message": "La consultation demandée n'existe pas"
}
```

#### 403 Forbidden
```json
{
  "isError": true,
  "error": "UNAUTHORIZED_ACCESS",
  "message": "Vous n'avez pas accès à cette consultation"
}
```

#### 400 Bad Request - Déjà annulée
```json
{
  "isError": true,
  "error": "CONSULTATION_ALREADY_CANCELLED",
  "message": "Cette consultation est déjà annulée"
}
```

#### 400 Bad Request - Statut invalide pour annulation
```json
{
  "isError": true,
  "error": "INVALID_CONSULTATION_STATUS_FOR_CANCELLATION",
  "message": "Impossible d'annuler une consultation avec ce statut"
}
```

#### 400 Bad Request - Annulation trop tardive
```json
{
  "isError": true,
  "error": "CANCELLATION_TOO_LATE",
  "message": "Il est trop tard pour annuler cette consultation"
}
```

### Exemple de requête (JavaScript/Fetch)
```javascript
const consultationId = '550e8400-e29b-41d4-a716-446655440000';

const cancellationData = {
  cancellationReason: "Changement de plans - Je dois reporter mon voyage"
};

const response = await fetch(`https://votre-api.com/consultations/my-consultations/${consultationId}/cancel`, {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer votre_token_jwt',
    'Accept-Language': 'fr',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(cancellationData)
});

const data = await response.json();
console.log(data);
```

### Exemple de requête (Axios)
```javascript
import axios from 'axios';

const consultationId = '550e8400-e29b-41d4-a716-446655440000';

const cancellationData = {
  cancellationReason: "Changement de plans - Je dois reporter mon voyage"
};

const response = await axios.patch(
  `https://votre-api.com/consultations/my-consultations/${consultationId}/cancel`,
  cancellationData,
  {
    headers: {
      'Authorization': 'Bearer votre_token_jwt',
      'Accept-Language': 'fr'
    }
  }
);

console.log(response.data);
```

---

## Structures de données

### ConsultationStatus (Enum)
Les statuts possibles d'une consultation :

```typescript
enum ConsultationStatus {
  PENDING = "PENDING",       // En attente d'assignation à un agent
  CONFIRMED = "CONFIRMED",   // Confirmée et assignée à un agent
  CANCELLED = "CANCELLED",   // Annulée
  COMPLETED = "COMPLETED"    // Terminée
}
```

### CreateConsultationDto
```typescript
{
  subject: string;                  // Requis - Sujet de la consultation
  description?: string;             // Optionnel - Description détaillée
  consultationDate: string;         // Requis - Date ISO 8601 (ex: "2024-07-20T10:00:00.000Z")
  duration?: number;                // Optionnel - Durée en minutes (défaut: 30, minimum: 15)
}
```

### UpdateConsultationDto
```typescript
{
  subject?: string;                 // Optionnel - Nouveau sujet
  description?: string;             // Optionnel - Nouvelle description
  consultationDate?: string;        // Optionnel - Nouvelle date ISO 8601
  duration?: number;                // Optionnel - Nouvelle durée (minimum: 15)
}
```

### CancelConsultationDto
```typescript
{
  cancellationReason: string;       // Requis - Raison de l'annulation
}
```

### ConsultationResponseDto
```typescript
{
  id: string;                       // UUID de la consultation
  customerId: string;               // UUID du client
  agentId?: string;                 // UUID de l'agent (null si non assigné)
  subject: string;                  // Sujet
  description?: string;             // Description
  consultationDate: string;         // Date ISO 8601
  duration: number;                 // Durée en minutes
  status: ConsultationStatus;       // Statut actuel
  cancelledAt?: string;             // Date d'annulation (null si non annulée)
  createdAt: string;                // Date de création
  updatedAt: string;                // Date de dernière modification
}
```

### ConsultationDetailResponseDto
Hérite de `ConsultationResponseDto` avec des relations incluses :

```typescript
{
  // ... tous les champs de ConsultationResponseDto
  customer?: {
    id: string;
    userId: string;
    phone?: string;
    user?: {
      email: string;
      firstName?: string;
      lastName?: string;
    }
  };
  agent?: {
    id: string;
    userId: string;
    phone?: string;
    specialty?: string;
    user?: {
      email: string;
      firstName?: string;
      lastName?: string;
    }
  }
}
```

### ConsultationListResponseDto
```typescript
{
  data: ConsultationResponseDto[];  // Liste des consultations
  total: number;                    // Nombre total de consultations
  page: number;                     // Numéro de page actuel
  limit: number;                    // Nombre d'éléments par page
}
```

---

## Codes d'erreur

Liste complète des codes d'erreur possibles :

| Code d'erreur | Description | HTTP Status |
|---------------|-------------|-------------|
| `CONSULTATION_NOT_FOUND` | La consultation n'existe pas | 404 |
| `CUSTOMER_NOT_FOUND` | Le client n'existe pas | 404 |
| `UNAUTHORIZED_ACCESS` | Accès non autorisé à cette consultation | 403 |
| `INVALID_CONSULTATION_DATE` | Date de consultation invalide | 400 |
| `CONSULTATION_DATE_IN_PAST` | La date doit être dans le futur | 400 |
| `TIME_SLOT_NOT_AVAILABLE` | Créneau horaire non disponible | 400 |
| `INVALID_CONSULTATION_STATUS` | Statut de consultation invalide pour cette opération | 400 |
| `CANNOT_CANCEL_CONSULTATION` | Impossible de supprimer cette consultation | 400 |
| `CONSULTATION_ALREADY_CANCELLED` | La consultation est déjà annulée | 400 |
| `INVALID_CONSULTATION_STATUS_FOR_CANCELLATION` | Impossible d'annuler avec ce statut | 400 |
| `CANCELLATION_TOO_LATE` | Délai d'annulation dépassé | 400 |

---

## Notes importantes

### 🔐 Authentification
- Toutes les requêtes nécessitent un token JWT valide
- Le token doit être envoyé dans le header `Authorization: Bearer <token>`
- Le client ne peut accéder qu'à ses propres consultations

### 🌍 Internationalisation
- Utilisez le header `Accept-Language` avec `fr` ou `en`
- Tous les messages d'erreur sont traduits automatiquement

### 📅 Dates
- Toutes les dates doivent être au format ISO 8601 : `YYYY-MM-DDTHH:mm:ss.sssZ`
- Exemple : `"2024-07-20T10:00:00.000Z"`
- Les dates sont en UTC

### ⏱️ Durée
- La durée minimale d'une consultation est de 15 minutes
- La durée par défaut est de 30 minutes
- La durée est exprimée en minutes (integer)

### 🔄 Statuts de consultation
- **PENDING** : En attente d'assignation (vous pouvez modifier/annuler)
- **CONFIRMED** : Confirmée avec un agent (vous pouvez modifier/annuler)
- **CANCELLED** : Annulée (aucune action possible)
- **COMPLETED** : Terminée (aucune action possible)

### ⚠️ Règles métier
- Vous ne pouvez modifier que vos propres consultations
- Vous ne pouvez pas modifier une consultation CANCELLED ou COMPLETED
- La date de consultation doit être dans le futur
- Une raison est obligatoire pour annuler une consultation
- Certaines consultations ne peuvent pas être annulées si le délai est dépassé

---

## Exemples de flux complets

### Flux 1 : Consultation et modification
```javascript
// 1. Récupérer toutes mes consultations
const consultations = await fetch('/consultations/my-consultations', {
  headers: { 'Authorization': 'Bearer token' }
});

// 2. Récupérer les détails d'une consultation
const detail = await fetch('/consultations/my-consultations/id-123', {
  headers: { 'Authorization': 'Bearer token' }
});

// 3. Modifier la consultation
const update = await fetch('/consultations/my-consultations/id-123', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    consultationDate: "2024-07-25T15:00:00.000Z"
  })
});
```

### Flux 2 : Annulation de consultation
```javascript
// 1. Vérifier le statut de la consultation
const consultation = await fetch('/consultations/my-consultations/id-123', {
  headers: { 'Authorization': 'Bearer token' }
});

// 2. Annuler si le statut le permet
if (consultation.data.status === 'PENDING' || consultation.data.status === 'CONFIRMED') {
  const cancel = await fetch('/consultations/my-consultations/id-123/cancel', {
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer token',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cancellationReason: "Changement de plans"
    })
  });
}
```

---

## Support
Pour toute question ou problème, contactez l'équipe de développement backend.
