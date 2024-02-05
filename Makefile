DOCKER_COMPOSE = docker-compose

.PHONY: all build up down restart logs ps stop

all: build up

build:
	$(DOCKER_COMPOSE) build

up:
	$(DOCKER_COMPOSE) up

down:
	$(DOCKER_COMPOSE) down

restart:
	$(DOCKER_COMPOSE) restart

logs:
	$(DOCKER_COMPOSE) logs

ps:
	$(DOCKER_COMPOSE) ps

stop:
	$(DOCKER_COMPOSE) stop