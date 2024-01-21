"use client";

import { AutomergeUrl } from "@automerge/automerge-repo";
import {
  RepoContext,
  useDocument,
} from "@automerge/automerge-repo-react-hooks";
import { automergeRepo, zaikoHandle } from "@/repositories/automerge";
import { ZaikoDoc, ZaikoItem } from "@/models";
import { useCallback } from "react";
import { uuid, next as A } from "@automerge/automerge";
import todoIcon from "@/svg/icons8-microsoft-todo-2019.svg";
import Image from "next/image";

const Table = ({ docUrl }: { docUrl: AutomergeUrl }) => {
  const [doc, updateDoc] = useDocument<ZaikoDoc>(docUrl);

  const addNewItem = useCallback(() => {
    updateDoc((doc) => {
      const item: ZaikoItem = {
        id: uuid(),
        name: "ポテチ",
        count: new A.Counter(0),
        link: "https://amazon.co.jp",
      };
      doc.zaikoList.push(item);
    });
  }, [updateDoc]);

  return (
    <div className="p-5">
      <div className="min-w-[410px]">
        <table className="overflow-x-auto table table-xs table-pin-rows table-pin-cols">
          <thead>
            <tr>
              <th>#</th>
              <td>商品名</td>
              <td>個数</td>
              <td>リンク</td>
              <td>Todoへ追加</td>
              <td>削除</td>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {doc?.zaikoList.map((item, idx) => {
              return (
                <tr key={item.id}>
                  <th>{idx}</th>
                  <td>
                    <span className="pr-1">{item.name}</span>
                    <button className="btn btn-xs">編集</button>
                  </td>
                  <td>
                    <div className="flex items-center">
                      <span className="mr-1">{item.count.value}</span>
                      <div className="flex">
                        <button className="btn btn-circle btn-outline btn-xs mr-1">
                          +
                        </button>
                        <button className="btn btn-circle btn-outline btn-xs mr-1">
                          -
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <a href={item.link} className="link pr-1">
                      リンク
                    </a>
                    <button className="btn btn-xs">編集</button>
                  </td>
                  <td>
                    <button className="btn btn-xs btn">
                      <Image
                        src={todoIcon}
                        style={{ height: 12, width: 12 }}
                        alt="Icon"
                      />
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-xs btn-error">x</button>
                  </td>
                </tr>
              );
            }) ?? []}
          </tbody>
        </table>
        <div className="flex justify-center">
          <button className="btn btn-block btn-xs" onClick={addNewItem}>
            追加
          </button>
        </div>
      </div>
    </div>
  );
};

const Main = () => {
  return (
    <RepoContext.Provider value={automergeRepo}>
      <Table docUrl={zaikoHandle.url} />
    </RepoContext.Provider>
  );
};

export default Main;
