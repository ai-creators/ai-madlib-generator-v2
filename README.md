# AI Madlib Generator

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Introduction

Ai madlib generator is an application originally built for Don the Developers ai wrangler hackathon a few years ago. It has been iterated and improved for the current user base.

This application is built on the T3 Stack with these technologies:

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Getting Started

### Installation

Run the command

`pnpm i --frozen-lockfile`

Create .env file and fill in the values from `.env.example`. To automate this run:

`cp .env.example .env`

### Optional

This app provides the ability to setup your database by running `./start-database.sh`. Docker is required to get this working.

## Testing

We currently only have e2e tests setup for speed of development
