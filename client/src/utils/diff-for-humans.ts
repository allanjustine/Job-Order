import { formatDistanceToNowStrict } from "date-fns";

export const diffForHumans = (date: string) => {
  return formatDistanceToNowStrict(new Date(date), {
    addSuffix: true,
  });
};
