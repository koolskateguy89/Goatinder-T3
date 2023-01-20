import type { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { MdClose, MdFavorite, MdModeComment } from "react-icons/md";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";

import type { getServerSideProps } from "pages/profile/[id]";
import Comment from "components/profile/Comment";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;
type Shoe = Props["user"]["liked"][number];

function ShoeComponent({
  shoe: { objectId, name, main_picture_url, _count },
  className,
}: {
  shoe: Shoe;
  className?: string;
}) {
  return (
    <article
      className={clsx(
        "flex h-32 flex-row items-center overflow-hidden px-4",
        className
      )}
    >
      <figure className="absolute h-28 w-28">
        <Image src={main_picture_url} alt={name} fill sizes="7rem" />
      </figure>

      <div className="flex basis-full flex-col items-center gap-y-2">
        <h3 className="link text-lg font-semibold">
          <Link href={`/shoes/${objectId}`}>{name}</Link>
        </h3>

        {/* stats */}
        <span className="flex gap-x-2 [&>*]:w-20 [&>*]:gap-1">
          <span className="badge badge-lg">
            <span className="sr-only">Number of comments:</span>
            <MdModeComment /> {_count.comments}
          </span>
          <span className="badge-success badge badge-lg">
            <span className="sr-only">Number of likes:</span>
            <MdFavorite /> {_count.likes}
          </span>
          <span className="badge-error badge badge-lg">
            <span className="sr-only">Number of dislikes:</span>
            <MdClose /> {_count.dislikes}
          </span>
        </span>
      </div>
    </article>
  );
}

export type ProfilePageTabsProps = {
  comments: Props["comments"];
  disliked: Shoe[];
  liked: Shoe[];
};

export default function ProfilePageTabs({
  comments,
  disliked,
  liked,
}: ProfilePageTabsProps) {
  return (
    <Tabs selectedTabClassName="tab-active">
      <TabList className="tabs [&>*]:basis-1/3 [&>*]:tab [&>*]:tab-bordered">
        <Tab>Comments</Tab>
        <Tab>Likes</Tab>
        <Tab>Dislikes</Tab>
      </TabList>

      <TabPanel className="space-y-2">
        {comments.length > 0 ? (
          <>
            {/* should heading be sr-only? */}
            <h2 className="text-2xl font-semibold">Comments</h2>

            <ul className="rounded-box divide-y-2 divide-gray-500 ring-2 ring-gray-500">
              {comments.map((comment) => (
                <li key={comment.id}>
                  <Comment comment={comment} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="pt-10 text-center text-lg">
            This user has not made any comments yet :/
            <div className="-rotate-6 transform text-sm opacity-50">{`maybe they're shy`}</div>
          </div>
        )}
      </TabPanel>

      <TabPanel className="space-y-2">
        {liked.length > 0 ? (
          <>
            <h2 className="text-2xl font-semibold">Liked shoes</h2>

            <ul className="rounded-box divide-y-2 divide-success ring-2 ring-success">
              {liked.map((shoe) => (
                <li key={shoe.objectId}>
                  <ShoeComponent shoe={shoe} className="ring-success" />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="pt-10 text-center text-lg">
            This user has not liked any shoes yet!
          </div>
        )}
      </TabPanel>

      <TabPanel className="space-y-2">
        {disliked.length > 0 ? (
          <>
            <h2 className="text-2xl font-semibold">Disliked shoes</h2>

            <ul className="rounded-box divide-y-2 divide-error ring-2 ring-error">
              {disliked.map((shoe) => (
                <li key={shoe.objectId}>
                  <ShoeComponent shoe={shoe} className="ring-error" />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="pt-10 text-center text-lg">
            This user has not disliked any shoes yet!
          </div>
        )}
      </TabPanel>
    </Tabs>
  );
}
