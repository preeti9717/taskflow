# Scalability Notes

## Current Architecture

This project follows a layered monolithic architecture:
`routes → controllers → services → models`

This pattern is intentionally chosen to be clean and easy to extend. Each layer has a single responsibility, making it straightforward to scale individual parts of the system as traffic grows.

---

## Horizontal Scaling

The backend is stateless — JWT tokens are verified on each request without server-side session storage. This means multiple instances of the API can run behind a **load balancer** (e.g. AWS ALB, Nginx) without any session-sharing problem. You can scale out by simply spinning up more instances.

---

## Database Scaling

MongoDB scales well horizontally via:

- **Replica sets** for read scaling and automatic failover
- **Sharding** to distribute data across multiple nodes as the dataset grows
- The `Task` model already includes a compound index on `{ owner, status }` to keep queries fast as the tasks collection grows

---

## Caching

Frequently read, rarely changed data (e.g. user profiles, task lists) can be cached using **Redis**:

- Cache `GET /tasks` responses per user with a short TTL
- Invalidate cache on task create, update, or delete
- This dramatically reduces MongoDB read load under high traffic

---

## Moving Toward Microservices

When this monolith outgrows a single codebase, it can be split along domain boundaries:

| Service | Responsibility |
|---|---|
| `auth-service` | Registration, login, JWT issuance |
| `task-service` | Task CRUD, filtering, ownership |
| `user-service` | Profile management, admin operations |

Each service would own its own database and communicate via REST or a message queue (e.g. RabbitMQ, Kafka) for async operations like notifications.

---

## Adding New Modules

The current folder structure supports new modules without restructuring anything:

```
src/
  models/       ← add a new Mongoose model
  services/     ← add business logic
  controllers/  ← add request handlers
  routes/v1/    ← add a new route file and register it in app.js
  validators/   ← add validation rules
```

For example, adding a `comments` feature on tasks would require only: `Comment.js` model, `commentService.js`, `commentController.js`, and `routes/v1/comments.js`. No existing files need restructuring.

---

## API Versioning

All routes are prefixed with `/api/v1/`. When breaking changes are needed, a `/api/v2/` router can be introduced alongside the existing one, allowing old clients to continue working without disruption.
