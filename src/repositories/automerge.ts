import { ZaikoDoc } from "@/models";
import {
  DocHandle,
  Repo,
  isValidAutomergeUrl,
} from "@automerge/automerge-repo";
import { BroadcastChannelNetworkAdapter } from "@automerge/automerge-repo-network-broadcastchannel";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";

export const automergeRepo = new Repo({
  network: [
    new BroadcastChannelNetworkAdapter(),
    new BrowserWebSocketClientAdapter("ws://localhost:5000/ws"),
  ],
  storage: new IndexedDBStorageAdapter(),
  enableRemoteHeadsGossiping: true,
});

const rootDocUrl = `${document.location.hash.substr(1)}`;
export let zaikoHandle: DocHandle<ZaikoDoc>;
if (isValidAutomergeUrl(rootDocUrl)) {
  zaikoHandle = automergeRepo.find<ZaikoDoc>(rootDocUrl);
} else {
  zaikoHandle = automergeRepo.create<ZaikoDoc>();
  zaikoHandle.change((d) => (d.zaikoList = []));
}
export const docUrl = (document.location.hash = zaikoHandle.url);

const key = setInterval(() => {
  zaikoHandle.on("change", () => console.log(zaikoHandle.doc));
  console.log(automergeRepo.peers);
  const peer = automergeRepo.peers.find((p) => p === "zaiko-server");
  if (peer != null) {
    const storageId = automergeRepo.getStorageIdOfPeer(peer);
    console.log(storageId);
    if (storageId != null) {
      automergeRepo.subscribeToRemotes([storageId]);
      clearInterval(key);
    }
  }
}, 1000);
