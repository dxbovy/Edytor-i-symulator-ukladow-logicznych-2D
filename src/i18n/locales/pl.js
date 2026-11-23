import { plChrome } from "./pl-chrome.js";
import { plStatus } from "./pl-status.js";

/** @type {Record<string, string>} */
export const pl = { ...plChrome, ...plStatus };