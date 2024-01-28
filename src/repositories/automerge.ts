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
    new BrowserWebSocketClientAdapter("wss://sync.automerge.org"),
  ],
  storage: new IndexedDBStorageAdapter(),
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
