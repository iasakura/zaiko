import { ZaikoDoc } from "@/models";
import { Repo } from "@automerge/automerge-repo";
import { BroadcastChannelNetworkAdapter } from "@automerge/automerge-repo-network-broadcastchannel";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";

export const automergeRepo = new Repo({
  network: [new BroadcastChannelNetworkAdapter()],
  storage: new IndexedDBStorageAdapter(),
});

export const zaikoHandle = automergeRepo.create<ZaikoDoc>();
zaikoHandle.change((d) => (d.zaikoList = []));
