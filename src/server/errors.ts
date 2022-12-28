export class AnotherRequestRunning extends Error {
  constructor() {
    super("There is another request pending.");
  }
}