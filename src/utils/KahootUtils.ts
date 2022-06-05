import puppeteer from "puppeteer";
import type { FunctionJob } from "./interfaces/interfaces";
import { KAHOOT_URL } from "./globals";
import { EmptyContent } from "./utils";

export const InitBrowser = async () =>
  await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--incognito", "--no-sandbox", "--single-process", "--no-zygote"],
  });

const WriteInput = async (
  page: puppeteer.Page,
  selector: string,
  NewValue: string
): Promise<FunctionJob> => {
  const KHInput = await page.$(selector);
  if (!KHInput) return { success: false };

  await KHInput.type(NewValue, { delay: 100 });
  if ((await KHInput.getProperty("value"))?._remoteObject?.value !== NewValue)
    return { success: false };

  return { success: true };
};

export const ConnectToGame = async (
  GameID: string,
  Username: string
): Promise<FunctionJob> => {
  try {
    const browser = await InitBrowser();

    const page = await browser.newPage();
    await page.goto(KAHOOT_URL);

    const content = await page.content();
    if (EmptyContent(content)) return { success: false };

    // const KHCodeInput = await page.$("#game-input");
    // if (!KHCodeInput) return { success: false };

    // await KHCodeInput.type(GameID, { delay: 100 });
    // if (
    //   (await KHCodeInput.getProperty("value"))?._remoteObject?.value !== GameID
    // )
    //   return { success: false };
    const WrCodeSuccess = await WriteInput(page, "#game-input", GameID);
    if (!WrCodeSuccess.success) return { success: false };

    await page.click(`[data-functional-selector="join-game-pin"]`);
    await page.waitForNavigation({ timeout: 2000 });

    console.log(page.url());
    if (page.url() !== "https://kahoot.it/join") return { success: false };

    const WrUsernameSuccess = await WriteInput(page, "#nickname", Username);
    if (!WrUsernameSuccess.success) return { success: false };

    await page.click(`[data-functional-selector="join-button-username"]`);
    await page.waitForNavigation({ timeout: 2000 });

    console.log(page.url());
    if (page.url() !== "https://kahoot.it/instructions")
      return { success: false };

    await browser.close();
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};
