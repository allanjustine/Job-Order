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
  // Diagnosis rows (NG items) share the sheet with jobs/parts, so they are
  // part of the page count too. Must match what ViewJobOrder renders.
  const diagnosisCount = data?.job_order_diagnosis?.length || 0;
  return buildTrimotorsPages(diagnosisCount, jobs.length, parts.length).length;
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
// ---------------------------------------------------------------------
// Trimotors: diagnosis + jobs + parts are paginated TOGETHER, so many NG
// diagnosis items can no longer push the job/parts rows off the sheet.
// Units = one table row. Calibrated from the constants above: with no NG
// items, page 1 holds 10 job rows and later pages hold 15 (same as before).
// ---------------------------------------------------------------------
const TM_JOB_OVERHEAD = 2; // JOB ORDER title + table header + totals row
const TM_FOOTER = 3; // grand total + next service schedule + printed on
const TM_DIAG_OVERHEAD = 1; // diagnosis title row

const TM_FIRST_PAGE_UNITS =
  JOB_ORDER_FIRST_PAGE_ITEMS + TM_JOB_OVERHEAD + TM_FOOTER; // 15
const TM_NEXT_PAGE_UNITS =
  JOB_ORDER_SUBSEQUENT_PAGE_ITEMS + TM_JOB_OVERHEAD + TM_FOOTER; // 20

export type TrimotorsPage = {
  ngStart: number; // diagnosis ROW range (2 NG items per row)
  ngEnd: number;
  jobStart: number; // job/parts row range
  jobEnd: number;
};

export const buildTrimotorsPages = (
  ngCount: number,
  jobCount: number,
  partsCount: number,
): TrimotorsPage[] => {
  let ngLeft = Math.ceil(ngCount / 2);
  let jobLeft = Math.max(jobCount, partsCount);
  let ngPos = 0;
  let jobPos = 0;
  const pages: TrimotorsPage[] = [];

  do {
    let budget = pages.length === 0 ? TM_FIRST_PAGE_UNITS : TM_NEXT_PAGE_UNITS;

    // 1) Diagnosis rows first
    let ngTake = 0;
    if (ngLeft > 0) {
      budget -= TM_DIAG_OVERHEAD;
      if (jobLeft === 0) {
        // nothing after it: keep room for the (empty) job table + footer
        const reserve = TM_JOB_OVERHEAD + 1 + TM_FOOTER;
        ngTake = Math.max(1, Math.min(ngLeft, budget - reserve));
      } else {
        ngTake = Math.max(1, Math.min(ngLeft, budget));
      }
      budget -= ngTake;
    }

    // 2) Job/parts rows get whatever room is left (footer room is always
    //    reserved, so the last page can always show totals + schedule)
    let jobTake = 0;
    if (ngLeft - ngTake === 0 && jobLeft > 0) {
      budget -= TM_JOB_OVERHEAD;
      jobTake = Math.max(0, Math.min(jobLeft, budget - TM_FOOTER));
    }

    pages.push({
      ngStart: ngPos,
      ngEnd: ngPos + ngTake,
      jobStart: jobPos,
      jobEnd: jobPos + jobTake,
    });
    ngPos += ngTake;
    ngLeft -= ngTake;
    jobPos += jobTake;
    jobLeft -= jobTake;
  } while (ngLeft > 0 || jobLeft > 0);

  return pages;
};