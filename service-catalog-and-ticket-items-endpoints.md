## Service Catalog & Ticket Service Items API

All endpoints require JWT auth (Bearer token) and are scoped under admin routes.

- Base URL prefix: `/admin`
- Content-Type: `application/json`

### Service Catalog

Resource path: `/admin/services`

Entity shape:

```
ServiceCatalogEntity {
  id: string;
  name: string;
  description?: string;
  priceFixed?: number;        // optional
  priceMin?: number;          // optional
  priceMax?: number;          // optional
  currency: 'IQD';
  isActive: boolean;
  category?: string;
  createdAt: string;          // ISO date
  updatedAt: string;          // ISO date
}
```

Rules:
- Use either `priceFixed` OR a range via `priceMin`/`priceMax`. If all are empty, price must be provided at ticket item level.

#### Create service
- POST `/admin/services`

Body:

```json
{
  "name": "Aydınlatma (spot lamba) değiştirme",
  "description": "",
  "priceFixed": 15000,
  "currency": "IQD",
  "isActive": true,
  "category": "Elektrik"
}
```

Responses:
- 201: returns created `ServiceCatalogEntity`

#### List services
- GET `/admin/services?search=<text>&page=<n>&limit=<n>`

Query support (from base controller): `search`, pagination. Filtering by `isActive`/`category` can be done client-side or extended later.

#### Get service by id
- GET `/admin/services/:id`

#### Update service
- PATCH `/admin/services/:id`

Body (partial):

```json
{
  "name": "Aydınlatma değişimi",
  "priceMin": 15000,
  "priceMax": 20000,
  "priceFixed": null,
  "isActive": true
}
```

#### Delete service
- DELETE `/admin/services/:id`

Notes: Soft delete is supported at DB level via `deletedAt`, but controller currently issues a standard delete through base repo logic.

---

### Ticket Service Items

Resource path: `/admin/ticket-service-items`

Entity shape (line item on a ticket):

```
TicketServiceItemEntity {
  id: string;
  ticket: { id: string };
  service?: { id: string } | null; // optional link to catalog
  title: string;                   // snapshot label
  quantity: number;                // default 1
  unitPrice?: number | null;       // optional override
  resolvedUnitPrice: number;       // final unit price resolved by backend
  currency: 'IQD';
  note?: string;
  createdAt: string;
  updatedAt: string;
}
```

Price resolution on create:
1. If `unitPrice` provided → use it.
2. Else if linked service has `priceFixed` → use it.
3. Else if service has both `priceMin` and `priceMax` → use average of the two.
4. Else if only `priceMin` exists → use `priceMin`.
5. Otherwise → 400/404 with message "Unable to resolve unit price".

#### Create ticket service item
- POST `/admin/ticket-service-items`

Body (with catalog link and no manual price):

```json
{
  "ticketId": "<ticket-uuid>",
  "serviceId": "<service-uuid>",
  "title": "Aydınlatma (spot lamba) değiştirme",
  "quantity": 1,
  "currency": "IQD"
}
```

Body (manual price, no catalog link):

```json
{
  "ticketId": "<ticket-uuid>",
  "title": "Özel işçilik",
  "quantity": 2,
  "unitPrice": 12500,
  "currency": "IQD",
  "note": "Malzeme hariç"
}
```

Responses:
- 201: returns created `TicketServiceItemEntity` with `resolvedUnitPrice`

#### List ticket service items
- GET `/admin/ticket-service-items?search=<text>&page=<n>&limit=<n>`
- Suggestion: filter client-side by `ticket.id` if needed (extend later with query param).

#### Get ticket service item by id
- GET `/admin/ticket-service-items/:id`

#### Update ticket service item
- PATCH `/admin/ticket-service-items/:id`

Body (partial):

```json
{
  "title": "Aydınlatma değişimi",
  "quantity": 3,
  "unitPrice": 15000,
  "note": "Ek işçilik"
}
```

Note: Updating `unitPrice` will effectively change the line total (no automatic recompute unless you change price fields explicitly).

#### Delete ticket service item
- DELETE `/admin/ticket-service-items/:id`

---

### Sample curl

Create service:

```bash
curl -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aydınlatma (spot)",
    "priceFixed": 15000,
    "currency": "IQD",
    "isActive": true
  }' \
  https://<api-host>/admin/services
```

Create ticket line item (from catalog):

```bash
curl -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": "<ticket-uuid>",
    "serviceId": "<service-uuid>",
    "title": "Aydınlatma (spot)",
    "quantity": 1,
    "currency": "IQD"
  }' \
  https://<api-host>/admin/ticket-service-items
```

Create ticket line item (manual price):

```bash
curl -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": "<ticket-uuid>",
    "title": "Özel işçilik",
    "quantity": 2,
    "unitPrice": 12500,
    "currency": "IQD",
    "note": "Malzeme hariç"
  }' \
  https://<api-host>/admin/ticket-service-items
```

---

### Frontend Notları
- Tutar göstergeleri: satır toplamı = `resolvedUnitPrice * quantity`.
- Bilet toplamı: tüm satır kalemleri üzerinden client tarafında kolayca hesaplanabilir; backend tarafında ticket detaylarına eklenmesi planlanabilir.
- Para birimi şimdilik `IQD`.


