// utils/job-order-pagination.ts

// Rows that fit on the FIRST printed page/copy (it also carries the
// vehicle info + diagnosis section, so less room for the tables).
export const JOB_ORDER_FIRST_PAGE_ITEMS = 10;
// Rows that fit on each SUBSEQUENT page/copy (continuation pages skip
// the vehicle info + diagnosis section, so more room for the tables).
export const JOB_ORDER_SUBSEQUENT_PAGE_ITEMS = 15;
/** @deprecated use JOB_ORDER_FIRST_PAGE_ITEMS / JOB_ORDER_SUBSEQUENT_PAGE_ITEMS instead. */
export const JOB_ORDER_ITEMS_PER_PAGE = JOB_ORDER_FIRST_PAGE_ITEMS;

// Given a 0-indexed print page, returns the [start, end) slice indices
// into the full jobs/parts arrays for that page.
export const getJobOrderPageRange = (
  page: number,
): { start: number; end: number } => {
  if (page <= 0) {
    return { start: 0, end: JOB_ORDER_FIRST_PAGE_ITEMS };
  }
  const start =
    JOB_ORDER_FIRST_PAGE_ITEMS +
    (page - 1) * JOB_ORDER_SUBSEQUENT_PAGE_ITEMS;
  return { start, end: start + JOB_ORDER_SUBSEQUENT_PAGE_ITEMS };
};

// Core page-count math, given just the max row count that needs to be
// laid out. Shared by every job-order print component regardless of
// its data shape.
export const getPrintPageCountForItems = (maxItems: number): number => {
  if (maxItems <= JOB_ORDER_FIRST_PAGE_ITEMS) return 1;
  const remaining = maxItems - JOB_ORDER_FIRST_PAGE_ITEMS;
  return 1 + Math.ceil(remaining / JOB_ORDER_SUBSEQUENT_PAGE_ITEMS);
};

// Helper for parents: how many print pages are needed to fit ALL
// job/part rows (not capped to 30 items / 2 pages anymore). First page
// holds JOB_ORDER_FIRST_PAGE_ITEMS rows, every page after that holds
// JOB_ORDER_SUBSEQUENT_PAGE_ITEMS rows.
// For the CERI-style job order view (data.job_order_details array).
export const getJobOrderPrintPageCount = (
  data?: Record<string, any>,
): number => {
  const jobs =
    data?.job_order_details?.filter(
      (item: any) => item.type === "job_request",
    ) || [];
  const parts =
    data?.job_order_details?.filter(
      (item: any) => item.type === "parts_replacement",
    ) || [];
  return getPrintPageCountForItems(Math.max(jobs.length, parts.length));
};

// For the motors/trimotors print job order (separate arrays of selected job/part
// keys rather than a single job_order_details array) — pass the
// selected jobs/parts counts directly.
export const getMotorsPrintPageCount = (
  jobsCount: number,
  partsCount: number,
): number => {
  return getPrintPageCountForItems(Math.max(jobsCount, partsCount));
};