import * as puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import type { FunctionJob } from "./interfaces/interfaces";
import { KAHOOT_URL } from "./globals";

export const InitBrowser = async () =>
  await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--incognito", "--no-sandbox", "--single-process", "--no-zygote"],
  });

const EmptyContent = (content: string): boolean => {
  if (!content || content.trim().length <= 0) {
    return true;
  }
  return false;
};

export const ConnectToGame = async (GameID: number): Promise<FunctionJob> => {
  const browser = await InitBrowser();

  const page = await browser.newPage();
  await page.goto(KAHOOT_URL);

  const content = await page.content();
  if (EmptyContent(content)) return { success: false };

  const $ = cheerio.load(content);

  return { success: true };
};
