import { MdClose, MdFavorite, MdModeComment } from "react-icons/md";

export type StatsProps = {
  comments: number;
  likes: number;
  dislikes: number;
};

export default function Stats({ comments, likes, dislikes }: StatsProps) {
  return (
    <span className="flex gap-x-2 [&>*]:w-20 [&>*]:gap-1">
      <span className="badge badge-lg">
        <span className="sr-only">Number of comments:</span>
        <MdModeComment /> {comments}
      </span>
      <span className="badge-success badge badge-lg">
        <span className="sr-only">Number of likes:</span>
        <MdFavorite /> {likes}
      </span>
      <span className="badge-error badge badge-lg">
        <span className="sr-only">Number of dislikes:</span>
        <MdClose /> {dislikes}
      </span>
    </span>
  );
}
