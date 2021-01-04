import Cancel from "./Cancel";

export default class CancelToken {
  promise;
  reason;

  constructor(executor) {
    let resolvePromise;
    this.promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    executor((message) => {
      if (this.reason) {
        return;
      }
      this.reason = new Cancel(message);
      resolvePromise(this.reason);
    });
  }

  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  static source() {
    let cancel;
    const token = new CancelToken((c) => {
      cancel = c;
    });
    return {
      cancel,
      token,
    };
  }
}
