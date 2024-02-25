"use client";

import { AutomergeUrl } from "@automerge/automerge-repo";
import {
  RepoContext,
  useDocument,
} from "@automerge/automerge-repo-react-hooks";
import { automergeRepo, docUrl } from "@/repositories/automerge";
import { ZaikoDoc, ZaikoItem } from "@/models";
import { uuid, next as A } from "@automerge/automerge";
import todoIcon from "@/svg/icons8-microsoft-todo-2019.svg";
import Image from "next/image";
import { updateText } from "@automerge/automerge/next";
import { TextBox, LinkBox } from "./TextBox";
import { getMsGraphClient } from "@/useMsGraphClient";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

const Table = ({ docUrl }: { docUrl: AutomergeUrl }) => {
  const [doc, updateDoc] = useDocument<ZaikoDoc>(docUrl);
  console.log(doc);
  const { status, update, ...token } = useSession();
  if (status !== "authenticated" || token.data?.access_token == null) {
    redirect("/api/auth/signin");
  }

  const accessToken = React.useRef<string>(token.data.access_token);
  if (accessToken.current !== token.data.access_token) {
    accessToken.current = token.data.access_token;
  }

  const client = React.useMemo(() => getMsGraphClient(accessToken.current), []);

  const addNewItem = React.useCallback(() => {
    updateDoc((doc) => {
      const item: ZaikoItem = {
        id: uuid(),
        name: "ポテチ",
        count: new A.Counter(0),
        url: "https://amazon.co.jp",
      };
      doc.zaikoList.push(item);
    });
  }, [updateDoc]);

  const setItemName = React.useCallback(
    (id: string, newName: string) => {
      updateDoc((doc) => {
        const itemIdx = doc.zaikoList.findIndex((item) => item.id === id);
        if (itemIdx < 0) {
          return;
        }
        updateText(doc, ["zaikoList", itemIdx, "name"], newName);
      });
    },
    [updateDoc]
  );

  const setItemUrl = React.useCallback(
    (id: string, newUrl: string) => {
      updateDoc((doc) => {
        const item = doc.zaikoList.find((item) => item.id === id);
        if (item == null) {
          return;
        }
        item.url = newUrl;
      });
    },
    [updateDoc]
  );

  const handleCntButtonClick = React.useCallback(
    (id: string, op: "incr" | "decr") => {
      updateDoc((doc) => {
        const item = doc.zaikoList.find((item) => item.id === id);
        if (item == null) {
          return;
        }
        if (op === "incr") {
          item.count.increment(1);
        } else {
          if (item.count.value > 0) {
            item.count.decrement(1);
          }
        }
      });
    },
    [updateDoc]
  );

  const removeItem = React.useCallback(
    (id: string) => {
      updateDoc((doc) => {
        const itemIdx = doc.zaikoList.findIndex((item) => item.id === id);
        if (itemIdx < 0) {
          return;
        }
        doc.zaikoList.splice(itemIdx, 1);
      });
    },
    [updateDoc]
  );

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
                    <TextBox
                      text={item.name}
                      onChange={(newName) => setItemName(item.id, newName)}
                    />
                  </td>
                  <td>
                    <div className="flex items-center">
                      <span className="mr-1">{item.count.value}</span>
                      <div className="flex">
                        <button
                          className="btn btn-circle btn-outline btn-xs mr-1"
                          onClick={() => handleCntButtonClick(item.id, "incr")}
                        >
                          +
                        </button>
                        <button
                          className="btn btn-circle btn-outline btn-xs mr-1"
                          onClick={() => handleCntButtonClick(item.id, "decr")}
                        >
                          -
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <LinkBox
                      text={item.url}
                      onChange={(newUrl) => setItemUrl(item.id, newUrl)}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-xs btn"
                      onClick={async () => {
                        console.log(
                          await client
                            .api(
                              // FIXME
                              `/me/todo/lists/${
                                process.env.NEXT_PUBLIC_TASK_LIST_ID ?? ""
                              }/tasks`
                            )
                            .post({
                              title: item.name,
                              linkedResources: [
                                {
                                  webUrl: item.url,
                                  applicationName: "Amazon",
                                  displayName: "リンク",
                                },
                              ],
                            })
                        );
                      }}
                    >
                      <Image
                        src={todoIcon}
                        style={{ height: 12, width: 12 }}
                        alt="Icon"
                      />
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => removeItem(item.id)}
                    >
                      x
                    </button>
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
      <Table docUrl={docUrl} />
    </RepoContext.Provider>
  );
};

export default Main;
