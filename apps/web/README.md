# TODO

- [ ] Change the way we do Redis keys.
- [ ] A different prompt should be a different entry in the database
  - [ ] Add a way for users to see which prompt was used in the screenshots page.
    - See the [note](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event) about the unreliable nature of beforeunload.
- [ ] Stop chat on exit
- [ ] Add filter
- [ ] Move server packages to common
- [ ] Add a Logo
- [ ] Don't show load all screenshots when data isn't loaded yet or when data is loading. Place the handleClick outside render. Or just do an infinite loader
- [ ] Add original widths and heights to the database
- [ ] Delete screenshot for sensitive information
- [ ] Extract Tailwind config into style guide. Then export a function from it that merges an input that overrides it using deepmerge.
