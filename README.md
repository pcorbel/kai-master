# Kai-Master

<div align="center">
  <img src="public/pwa-192x192.png" alt="Kai-Master">
</div>

Kai-Master is a modern, mobile-first Progressive Web Application (PWA) that brings the classic Lone Wolf gamebook series to life. Experience Joe Dever's epic adventures in a sleek, intuitive interface designed for both newcomers and long-time fans of the series.

<div align="center">
  <img src="public/kai-master.gif" alt="Kai-Master App">
</div>

## 🌟 Features

- 📚 Play the 20 Kai, Magnakai and Grand Master Lone Wolf gamebooks
- 📱 Mobile-first design for on-the-go play
- 🏠 Offline support for uninterrupted adventures
- 🎲 Interactive combat system
- 🗺️ Easy navigation through sections, with footnotes, signposts and price lists kept intact
- 📲 Installable as a PWA for a native app-like experience

## 🚀 Getting Started

### Play Now

You can start your adventure right away by visiting:

[https://kai-master.corbel.dev](https://kai-master.corbel.dev)

No installation required! Just open the link in your favorite web browser and begin your journey as a Kai Lord.

### Install as a PWA

Kai-Master is a Progressive Web App, which means you can install it on your device for a native app-like experience. Here's how:

#### On Android:

1. Open [https://kai-master.corbel.dev](https://kai-master.corbel.dev) in Chrome
2. Tap the menu icon (3 dots) in the top right corner
3. Tap "Add to Home screen"
4. Follow the on-screen instructions

#### On iOS:

1. Open [https://kai-master.corbel.dev](https://kai-master.corbel.dev) in Safari
2. Tap the Share button at the bottom of the screen
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" in the top right corner

Once installed, you can launch Kai-Master from your home screen or app drawer, just like any other app!

## 📖 How to Play

1. Visit [https://kai-master.corbel.dev](https://kai-master.corbel.dev) in your web browser or open the installed PWA.
2. Choose a Lone Wolf book from the available titles.
3. Read through the introduction and game rules.
4. Set up your character by selecting Kai disciplines and equipment.
5. Navigate through the story by making choices and turning to new sections.
6. Engage in combat using the interactive combat system.
7. Manage your inventory and stats in the Action Chart.
8. Try to complete your mission and become a true Kai Master!

## 🛠️ Development

```bash
yarn                 # install dependencies
yarn dev             # start the dev server on http://localhost:3000
yarn test            # unit tests (parser, combat table, store, state migration)
yarn typecheck       # vue-tsc over the whole app
yarn books:download  # fetch the 20 Project Aon zips into .cache/books (not committed)
yarn test:books      # run the parser against every downloaded book and check nothing is lost
yarn books:dump      # write the parsed books as JSON into .cache/books/json
yarn lint            # ESLint, and the formatter (no Prettier here): yarn lint:fix formats
yarn build && yarn test:e2e   # Playwright smoke tier against the built output and a stubbed Project Aon
```

Books are downloaded from [Project Aon](https://www.projectaon.org) on first play and parsed in the
browser into a semantic JSON structure (typed paragraphs: text, choice, combat, image, table,
signpost, footnote…). The same parser powers `yarn books:dump`, so the JSON files it produces are the
reference data for any other reader built on top of this project.

## 🚢 Deployment

Pushed to `main`, a green CI run (`.github/workflows/ci.yml`: lint, typecheck, unit
tests, build, e2e) publishes a single `latest` image to
`ghcr.io/pcorbel/kai-master` and watchtower on the homelab rolls it out. Merging
ships; the `verify` job is the gate. No other tag is published, so a rollback is
a revert commit rather than a pin to an older image; the OCI labels on `latest`
carry the revision it was built from.

The container is stateless and unprivileged: reading progress lives in the
reader's browser, books are fetched from Project Aon through `/api/books` and
cached by the PWA. Traefik terminates TLS. The live compose file is in the
homelab `arr-stack` repository. The only runtime setting is
`NUXT_BOOKS_BASE_URL`, which defaults to `https://www.projectaon.org`.

```bash
docker build -t kai-master .
docker run --rm -p 3000:3000 kai-master
```

## 🤝 Contributing

We welcome contributions from the community! If you'd like to contribute to Kai-Master, please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Joe Dever, for creating the amazing Lone Wolf series
- Gary Chalk, for the original illustrations
- [Project Aon](https://www.projectaon.org/), for their efforts in preserving and distributing the Lone Wolf books
- All the fans and contributors who have kept the spirit of Lone Wolf alive

## 📞 Contact

If you have any questions, suggestions, or just want to say hello, feel free to reach out:

- Project Link: [https://github.com/pcorbel/kai-master](https://github.com/pcorbel/kai-master)

---

May the power of the Kai and the wisdom of the ancients guide you on your journey, brave reader!
