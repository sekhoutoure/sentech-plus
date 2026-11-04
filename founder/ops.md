# Plan Opérations & Procédures Quotidiennes (SOPs) : SenTechPLUS Dakar

*Définit le fonctionnement réel sur le terrain à Dakar : approvisionnements, coursiers moto, emballage sécurisé, gestion des flux et registre des risques.*

---

## 1. Le Cycle Quotidien d'Opérations (08h00 - 20h00)

```
08h00 - 08h30 | Ouverture & Vérification Stock (Stock tampon Sacré-Cœur)
  • Contrôle des commandes passées la nuit sur www.sentechplus.com et WhatsApp.
  • Test des terminaux de réception (WhatsApp Business & Dashboard Admin).
  • Point météo et trafic routier à Dakar (état VDN, Corniche, Autoroute).

08h30 - 18h30 | Flux Continu Préparation & Dispatch Express (H+2)
  • Notification commande reçue (SMS client + alerte WhatsApp).
  • Picking de l'article sous blister + prélèvement du câble offert.
  • Pose du sticker de sécurité holographique SenTechPLUS.
  • Impression du bordereau de livraison (détail montant Wave/Espèces).
  • Remise au coursier moto de permanence (zone Centre ou zone Almadies/Banlieue).
  • Appel préalable du coursier au client 15 minutes avant arrivée sur site.

18h30 - 19h30 | Rapprochement Financier & Encaissements
  • Réception des versements Wave Business & dépôts d'espèces des coursiers.
  • Clôture des statuts de livraison dans le panneau d'administration (`admin/orders.php`).
  • Contrôle des éventuels retours ou reports d'adresse.

19h30 - 20h00 | Réassort & Clôture
  • Inventaire physique des Hero SKUs restants.
  • Déclenchement automatique de commande réassort si stock < seuil d'alerte (5 unités).
```

---

## 2. Fournisseurs & Approvisionnements Réels

| Poste de coût | Fournisseurs identifiés | Conditions, Délais & Tarifs constatés | Contact / Approvisionnement |
| :--- | :--- | :--- | :--- |
| **Chargeurs GaN 33W & 65W Certifiés** | Grossistes officiels Baseus / Ugreen / Anker (Guangzhou & Dubaï) via fret aérien express Dakar (DHL/Cargo express). | 5 500 à 7 000 FCFA / unité selon puissance. MOQ : 50 pièces. Délai réappro : 5 à 7 jours ouvrés. | Fournisseur vérifié avec certificat d'authenticité usine. |
| **Câbles Nylon Tressés 60W/100W** | Fabricant d'accessoires connectiques certifiés USB-IF (Shenzhen). | 1 200 à 1 500 FCFA / pièce par lot de 200. Délai : 7 jours par fret groupé. | Inclus comme cadeau de bienvenue dans le Pack Hero. |
| **Packaging Sécurisé & Scellés Holographiques** | Imprimerie locale dakaroise (Zone Industrielle / Médina) pour les pochettes + Fabricant de stickers sécurisés VOID. | Pochettes kraft renforcées : 150 F/unité. Stickers holographiques personnalisés : 250 F/unité. Lot de 500 : 200 000 FCFA. | Imprimerie Dakar Express / PackSen. |
| **Flotte Coursiers Moto Dédiée** | 2 livreurs indépendants expérimentés équipés de motos 125cc récentes et sacoches isothermes/étanches. | Forfait mensuel fixe garanti : 125 000 FCFA / livreur + prime de 500 FCFA par course livrée en moins de 90 min. | Recrutement direct avec caution et garant physique à Dakar. |

---

## 3. Organisation de l'Équipe & Rémunérations

### Mois 1 (Phase de Démarrage Lean)
* **1 Responsable d'Exploitation & Dispatching (Fondateur ou Lead Ops) :**
  * *Horaires :* 08h00 - 19h00 (Lundi au Samedi).
  * *Missions :* Validation des commandes web, emballage soigné, relation client WhatsApp, supervision des encaissements Wave.
  * *Budget alloué :* 250 000 FCFA / mois.
* **2 Coursiers Moto Dédiés Dakar :**
  * *Répartition géographique :*
    * **Coursier 1 (Axe Sud/Centre) :** Plateau, Médina, Fann, Point E, Mermoz, Sacré-Cœur.
    * **Coursier 2 (Axe Ouest/Nord) :** Ouakam, Ngor, Almadies, Yoff, Mamelles, Maristes.
  * *Rémunération :* 125 000 FCFA fixe chacun + prime de performance = 250 000 FCFA / mois total.

---

## 4. Procédures Opérationnelles Standard (SOPs)

### SOP 1 : Préparation & Emballage d'une Commande (3 minutes max)
1. Prendre le produit scellé d'usine dans le casier stock correspondant au SKU.
2. Vérifier visuellement l'intégrité de la boîte d'origine.
3. Insérer le câble tressé 100W offert dans la pochette SenTechPLUS.
4. Glisser la carte de garantie 12 mois avec le numéro de série écrit.
5. Fermer la pochette et apposer le sticker holographique numéroté sur le rabat.
6. Agrafer le bon de livraison format ticket avec le QR code Wave du coursier.

### SOP 2 : Protocole de Livraison chez le Client (Le moment de vérité)
1. Le coursier appelle le client dès son départ : *« Bonjour [Nom], c'est votre coursier SenTechPLUS, je suis en route, j'arrive dans 25 minutes à votre adresse. »*
2. À l'arrivée : Présenter le colis scellé intact.
3. **Invitation à l'inspection :** Inviter poliment le client à vérifier le modèle et le sceau : *« Vous pouvez vérifier la boîte et le sceau officiel avant le règlement. »*
4. **Encaissement :**
   * *Si Wave :* Présenter le QR code du compte marchand SenTechPLUS sur le smartphone du coursier.
   * *Si Espèces :* Encaisser et rendre la monnaie exacte (le coursier dispose toujours d'un fond de caisse de 15 000 FCFA en petites coupures).
5. Remettre le ticket tamponné et souhaiter une excellente utilisation.

### SOP 3 : Gestion d'une Panne sous Garantie 12 Mois (Échange Express H+24)
1. Le client signale un problème via WhatsApp avec une courte vidéo montrant le chargeur branché.
2. Le service client valide la prise en charge sans exiger de déplacement en boutique.
3. Le coursier est mandaté avec une unité neuve sous blister dans sa tournée du lendemain.
4. Le coursier remet l'unité neuve et récupère l'unité défectueuse pour retour au SAV fournisseur.

---

## 5. Outils & Stack Technologique

* **Boutique en ligne & Panier :** Moteur PHP 8.2 / MySQL haute performance déployé sur `sentechplus.com` (architecture légère, sans framework lourd, temps de chargement < 800 ms sur réseau 4G Dakar).
* **Paiement Marchand :** Compte Wave Business certifié (0 frais de retrait pour le client, QR code dynamique).
* **Communication & Conciergerie :** WhatsApp Business sur PC et smartphone avec messages automatisés de confirmation.
* **Gestion des stocks :** Panneau d'administration sécurisé `admin/products.php` et `admin/orders.php`.

---

## 6. Formalités Légales & Réglementaires au Sénégal

1. **Registre de Commerce (RCCM) :** Enregistrement au Tribunal de Commerce de Dakar (forme juridique SASU ou Entreprise Individuelle).
2. **Numéro d'Identification Nationale (NINEA) :** Attribution par la Direction Générale des Impôts et Domaines (DGID) pour la facturation en règle.
3. **Contrat de Prestation Transport Moto :** Contrats formalisés avec les livreurs stipulant l'obligation de permis de conduire valide, casque homologué et assurance moto en cours de validité.
4. **Déclaration Données Personnelles :** Déclaration simplifiée de conformité CDP (Commission des Données Personnelles du Sénégal) pour la protection des numéros de téléphone des clients.

---

## 7. Registre des Risques & Plans de Secours (Contingency)

| Risque identifié | Probabilité | Impact | Solution de secours immédiate |
| :--- | :---: | :---: | :--- |
| **1. Gros embouteillages imprévus (Pluie, sommet, accident VDN)** | Élevée | Moyen | Les motos disposent d'itinéraires secondaires cartographiés. En cas de dépassement des 90 min, envoi automatique d'un message WhatsApp au client avec géolocalisation en direct du livreur + bon de 2 000 F offert sur la prochaine commande. |
| **2. Rupture inattendue du chargeur Hero 65W** | Moyenne | Élevé | Stock tampon de sécurité de 15 unités bloqué à Sacré-Cœur, non vendu en ligne, réservé aux urgences. Commande réassort déclenchée dès 10 unités restantes. |
| **3. Panne de réseau mobile / Panne Wave lors de la livraison** | Faible | Faible | Le coursier accepte le paiement en espèces ou note le numéro du client pour encaissement différé (validé pour les clients en entreprise/bureaux). |
| **4. Client absent à l'adresse indiquée** | Moyenne | Faible | Appel obligatoire 15 min avant départ. Si absent, replanification gratuite sur le créneau suivant ou livraison le lendemain matin. |
| **5. Taux de retour produit défectueux > 3%** | Faible | Élevé | Blocage immédiat du lot fournisseur concerné et recours sous garantie grossiste. Remplacement client immédiat depuis le stock tampon. |
