/** The easiest way to use the Worker API.  */
export default class HardWorker {
  /**
  * Creating and applying config.
  * @param {object} config - Config object send by the user.
  */
  constructor(config) {
    this.config = config || {};
    this.imageList = [];

    this.config.disabled = this.preConfig();
    this.setConfig();
  };

  /**
    * Get the browser is supporting Worker API features.
    * @return {bool} The browser is supporting Worker features.
    */
  preConfig() {
    if (
      window.hasOwnProperty("Worker") === true &&
      Worker.hasOwnProperty("prototype") === true &&
      Worker.prototype.hasOwnProperty("onerror") === true &&
      Worker.prototype.hasOwnProperty("onmessage") === true &&
      Worker.prototype.hasOwnProperty("postMessage") === true &&
      Worker.prototype.hasOwnProperty("terminate") === true) {
      return false;
    } else {
      return true;
    }
  };

  /**
    * Applying config file to HardWorker.
    */
  setConfig() {
    // If browser is not supporting Worker API, disable to run.
    if (this.config.disabled === true) {
      this.config.threadCount = -1;
      return;
    }

    // Checking config file has multiplier, if doesnt exist appy to default 1.
    this.config.multiplier = this.config.multiplier || 1;

    // Checking computer thread count.
    // If browser doest support `navigator.hardwareConcurrency` set as default 1.
    this.config.navigatorThreadCount = navigator.hardwareConcurrency || 1;

    // Set the active thread count.
    // Floor(Thread Count * Multiplier)
    this.config.threadCount = Math.floor(this.config.navigatorThreadCount * this.config.multiplier);

    if (this.config.threadCount > this.config.maxThread) {
      this.config.threadCount = this.config.maxThread;
    }

    this.config.maxThread = this.config.maxThread || this.config.threadCount;

    this.config.minThread = this.config.minThread || 1;

    if (this.config.threadCount < this.config.minThread) {
      this.config.threadCount = -1;
    }
  };

  /**
    * Creating the Worker Javascript file as blob object URL.
    * @param {function} f - Function to be created as a blob.
    * @return {string} Worker blob url.
    */
  attach(f) {
    let script = new Blob(
      [`(${String(f)})()`],
      { type: 'application/javascript' }
    );

    this.blob = URL.createObjectURL(script);
    return this.blob;
  };

  /**
    * Creating a new Worker instance.
    * @return {Object} Worker promise object.
    */
  createWorker(arr) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(this.blob);
      this.imageList.push(worker);

      // Waiting for a message and resolve
      worker.onmessage = ({ data }) => resolve(data);

      // If get an error, reject the promise
      worker.onerror = reject;

      // Post a message to the Worker
      worker.postMessage(arr);
    });
  };

  /**
    * The Worker API onmessage implementation.
    * @param {f} message - Message callback function, it will trigger Worker.onmessage().
    */
  onmessage(f) {
    this._setWorker();
    this.image.onmessage = f;
  };

  /**
    * The Worker API onerror implementation.
    * @param {f} error - Onerror callback function, it will trigger Worker.onerror().
    */
  onerror(f) {
    this._setWorker();
    this.image.onerror = f;
  };

  /**
    * The Worker API postmessage implementation.
    * @param {*} messages - PostMessage callback function, it will trigger Worker.postMessage().
    */
  postMessage(...v) {
    this._setWorker();
    this.image.postMessage(...v);
  };

  /**
    * Slice to the array as given sized chunks.
    * @param {*} Array - The list of items.
    * @param {number} Count - The count of chunk slice.
    * @return {*} Chunks of the given list items.
    */
  chunk(arr, count) {
    if (count <= 0 || typeof count !== "number")
      return [];

    if (count === 1) return arr;

    if (Array.isArray(arr) !== true || arr.length === 0)
      return [];

    let chunks = {
      temp: [],
      index: 0,
      size: arr.length
    };

    while (chunks.index < chunks.size) {
      if (chunks.index + count + 1 === chunks.size) count++;
      chunks.temp.push(arr.slice(chunks.index, chunks.index += count));
    }

    return chunks.temp;
  };

  /**
    * Terminate to all Worker instances.
    * @return {bool} Workers is terminated.
    */
  terminate() {
    // Hardworker has single instance of Worker.
    if (typeof this.image !== "undefined") {
      this.image.terminate();
      return true;
    };

    // Hardworker has multiple instance of Worker.
    if (this.imageList.length !== 0) {
      this.imageList.map(w => w.terminate());
      return true;
    };

    return false;
  };

  /**
    * It bounces the given array to the worker as much as the threads in the CPU and enables it to be processed.
    * @param {*} Array - The list of items.
    * @return {Object} The instances of createWorker.
    */
  async postArray(arr) {
    if (this.config.threadCount < 0) return [];

    const size = Math.round(arr.length / this.config.threadCount);
    const chunks = this.chunk(arr, size);

    const promises = chunks.map(c =>
      this.createWorker(c)
    );

    return await Promise.all(promises);
  };

  /**
    * When Worker image if doesn't exist then assign to the `this.image`.
    */
  _setWorker() {
    if (this.image === "undefined")
      this.image = new Worker(this.blob);
  }
};