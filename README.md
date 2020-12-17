## HardWorker
The easiest way to use the Worker API

### Usage

```js
  let worker = new HardWorker();

  worker.attach(function (event) {

    function sort(arr) {
      return arr.sort((a, b) => a - b);
    }

    onmessage = ({ data }) => {
      const sorted = sort(data);
      postMessage(sorted);
      close();
    };
  });

  console.time("Array created");

  const arr = Array(10000000)
    .fill()
    .map(() => Math.random());

  console.timeEnd("Array created");

  window.onload = function () {
    console.time("Worker runned");
    worker.postArray(arr).then(x => {
      //console.log(x);
      console.timeEnd("Worker runned");
    }).catch(e => {
      console.log(e);
    })
  };
```
