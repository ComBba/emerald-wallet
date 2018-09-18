const { app, protocol, webContents } = require('electron');
const log = require('../logger');

const getMainWebContents = () => webContents
      .getAllWebContents()
      .find((webcontent) => !!webcontent.browserWindowOptions);

function protocolHandler(event, url) {
  if (event) { event.preventDefault(); }
  // need to ignore other windows such as chrome dev tools
  const wc = getMainWebContents();

  if (!wc) {
    log.info('not sure we ever actually hit this anymore');
    setTimeout(() => protocolHandler(null, url), 500);
    return;
  }

  wc.send('protocol', { url });
  log.info("open-url: " + url);
}

function startProtocolHandler() {

  app.on('will-finish-launching', () => {
    app.on('open-url', protocolHandler);
  });
}

function registerProtocol() {
  app.setAsDefaultProtocolClient('ethereum');

  // protocol.interceptStringProtocol('ethereum', (request, callback) => {
  //   ////didnt freeze
  //   log.info('is this actually doing anything at all??');
  //   const wc = getMainWebContents();
  //   wc.send('protocol', request);
  // }, (err) => {
  //   log.info('hit error handler');
  //   if (err) { log.error(err); }
  // });
}

module.exports = {
  startProtocolHandler,
  registerProtocol
};
