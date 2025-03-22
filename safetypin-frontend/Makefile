.PHONY: install test test-watch test-ci test-e2e lint format dev build up down

# Development
install:
	npm ci

dev:
	npm start

# Testing
test:
	npm test

test-watch:
	npm run test:watch

test-ci:
	npm run test:ci

test-e2e:
	npm run cypress:run

# Docker testing
docker-test:
	docker-compose -f docker-compose.test.yml run --rm test

docker-test-watch:
	docker-compose -f docker-compose.test.yml run --rm test:watch

docker-e2e:
	docker-compose -f docker-compose.test.yml up -d app
	docker-compose -f docker-compose.test.yml run --rm cypress
	docker-compose -f docker-compose.test.yml down

# Linting & Formatting
lint:
	npm run lint

lint-fix:
	npm run lint:fix

format:
	npm run format

# Docker compose
up:
	docker-compose up

down:
	docker-compose down

# Building
build:
	npm run build

docker-build:
	docker build -t safetypin-frontend .

# CI/CD
ci: lint test-ci build
