import assert from 'assert';
import WebSocket from 'ws';
import config from 'config';


describe('BarkChat server', () => {
  describe('Create Websocket Server', () => {
    it('WebSocket should be created', () => {
      const serverCfg = config.get('Server.srvConfig');
      const wss = new WebSocket.Server({
        host: serverCfg.host,
        port: serverCfg.port,
      });
      assert.strictEqual(typeof wss, 'object');
      assert.strictEqual(serverCfg.host, 'localhost');
      assert.strictEqual(serverCfg.port, '3302');
      wss.close();
    });
  });
});
