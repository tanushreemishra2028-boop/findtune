# FindTune

This repository contains the recovered AI Studio source for FindTune. The app currently runs as a **free sample-catalog preview**. It does not charge users or claim that a sample match came from a live music search.

## Run locally

```sh
npm install
npm run dev
```

`npm run build` produces the static site in `dist/`. Vercel can build this repository with that command and publish `dist/`.

## Before adding live search or payments

The original export included an API token in browser code and a test payment flow that could label an unpaid session as paid. They are removed from this preview. Use a server-side API for third-party tokens, and verify payment status with the payment provider on the server before unlocking a paid result. Never place credentials in Vite client environment variables or commit them to this repository. Rotate any token previously committed to the public repository.
