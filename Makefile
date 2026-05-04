up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f

dev:
	node updateEnv.js && npm run dev --prefix frontend
