import { ZaikoDoc } from "@/models";
import {
  DocHandle,
  Repo,
  isValidAutomergeUrl,
} from "@automerge/automerge-repo";
import { BroadcastChannelNetworkAdapter } from "@automerge/automerge-repo-network-broadcastchannel";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";

export const automergeRepo = new Repo({
  network: [new BroadcastChannelNetworkAdapter()],
  storage: new IndexedDBStorageAdapter(),
});

const rootDocUrl = `${document.location.hash.substr(1)}`;
export let zaikoHandle: DocHandle<ZaikoDoc>;
console.log(document.location.hash);
if (isValidAutomergeUrl(rootDocUrl)) {
  zaikoHandle = automergeRepo.find<ZaikoDoc>(rootDocUrl);
} else {
  zaikoHandle = automergeRepo.create<ZaikoDoc>();
  zaikoHandle.change((d) => (d.zaikoList = []));
}
export const docUrl = (document.location.hash = zaikoHandle.url);
