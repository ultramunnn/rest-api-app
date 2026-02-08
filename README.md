<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">Framework <a href="http://nodejs.org" target="_blank">Node.js</a> progresif untuk membangun aplikasi server-side yang efisien dan scalable.</p>
<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
  <a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
  <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

## Deskripsi

Simple REST API dengan NestJS + TypeScript untuk fitur Users dan Posts, autentikasi JWT, dan E2E testing.

## Pola Arsitektur

**Feature-based modular architecture** (modul per domain: `auth`, `users`, `posts`, `database`, `common`).

**Alasan menggunakan pola ini**
- Pemisahan tanggung jawab jelas: tiap domain punya controller, service, DTO, dan model sendiri.
- Mudah dikembangkan: tambah fitur baru tanpa mengganggu modul lain.
- Testability lebih baik: unit test per module dan E2E test bisa menggabungkan modul.
- Konsisten dengan praktik umum NestJS, jadi onboarding dan maintenance lebih cepat.

## Struktur Folder (src)

```
src/
  auth/        # auth + JWT
  common/      # guards, shared stuff
  config/      # config loader
  database/    # sequelize setup
  posts/       # posts feature
  users/       # users feature
  app.module.ts
  main.ts
```

## Setup Project

```bash
npm install
```

## Compile & Menjalankan Project

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Menjalankan Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## API Documentation (Swagger UI)

Setelah aplikasi berjalan, buka:

- Swagger UI: `http://localhost:3000/docs`
- Base API: `http://localhost:3000/api`

Untuk endpoint yang protected, klik tombol **Authorize** di Swagger UI lalu isi:

`<accessToken>` (tanpa prefix `Bearer`, Swagger UI akan menambahkan otomatis)

## Deployment

Saat akan deploy ke production, ikuti dokumentasi deployment NestJS: https://docs.nestjs.com/deployment

## Resources

- Dokumentasi NestJS: https://docs.nestjs.com
- Discord: https://discord.gg/G7Qnnhy
- Courses: https://courses.nestjs.com

## Lisensi

Nest menggunakan lisensi MIT: https://github.com/nestjs/nest/blob/master/LICENSE
