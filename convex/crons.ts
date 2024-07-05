import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.monthly(
  "Clear all files older than 1 month",
  { day: 1, hourUTC: 12, minuteUTC: 0 },
  internal.files.deleteAllFilesByCrons
);
export default crons;
