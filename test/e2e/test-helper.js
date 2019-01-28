const idArray = [];
let lastRequest;

const setIntervalWS = (callback, delay) => {
  const intervalID = setInterval(() => {
    callback();
  }, delay);
  return intervalID;
};

module.exports = {
  waitUntilNoRequests: idleTime => new Promise((resolve) => {
    const intervalID = setIntervalWS(() => {
      const silence = new Date().getTime() - lastRequest;
      // console.log('Silence', silence, idArray.length === 0, silence > idleTime);
      if (idArray.length === 0 && silence > idleTime) {
        clearInterval(intervalID);
        resolve();
      }
    }, 100);
  }),
  init: (client) => {
    client.on('Network.webSocketFrameSent', ({ response }) => {
      const sentJSON = JSON.parse(response.payloadData);
      idArray.push(sentJSON.id);
      lastRequest = new Date().getTime();
    });

    client.on('Network.webSocketFrameReceived', ({ response }) => {
      const receivedJSON = JSON.parse(response.payloadData);

      const index = idArray.indexOf(receivedJSON.id);
      if (index > -1) {
        idArray.splice(index, 1);
      }
    });
  },
};
