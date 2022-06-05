import puppeteer from "puppeteer";
import type { FunctionJob } from "./interfaces/interfaces";
import { KAHOOT_URL } from "./globals";
import { EmptyContent } from "./utils";
import { KahootStep } from "./interfaces/enums";

export const InitBrowser = async (): Promise<puppeteer.Browser | undefined> => {
  try {
    return await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: ["--incognito", "--no-sandbox", "--single-process", "--no-zygote"],
    });
  } catch (err) {
    console.error("[No Browser]");
    console.error(err);
    return undefined;
  }
};
export const LauchBotGame = async (
  GameID: string,
  Username: string
): Promise<FunctionJob> => {
  try {
    const browser = await InitBrowser();
    if (!browser) return { success: false };
    /* Connection To Kahoot Game */
    const { success: connected, returns: page } = await ConnectToGame(
      browser,
      GameID,
      Username
    );
    if (!connected || !page) return { success: false };

    /* Listening to Game Change */
    const { success: GameFinishedSuccessfully } = await WatchDogGame(page);
    if (!GameFinishedSuccessfully) return { success: false };

    /* Game Finished: Quit */
    await browser.close();
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

/* HELPERS */
const WatchDogGame = (page: puppeteer.Page): Promise<FunctionJob> => {
  return new Promise(async (res) => {
    try {
      console.log("[LOG]: Waiting for game to start...");
      await page.waitForNavigation({ timeout: 300_000 }); // Wait 5min for change, if no: quit
      if (page.url() !== KahootStep.STARTING) return res({ success: false });
      console.log("[LOG]: Waiting first question...");
      await page.waitForNavigation({ timeout: 15_000 }); // Wait for 1st question (15s)

      const NewQuestion = async () => {
        if (page.url() !== KahootStep.GET_READY) return res({ success: false });
        console.log("[LOG]: Waiting answer options...", page.url());

        await page.waitForNavigation({ timeout: 10_000 }); // Wait for question's answers to display (10s)
        if (page.url() !== KahootStep.ANSWER_CHOOSE)
          return res({ success: false });

        // Choose answer randomly
        await page.click(`[data-functional-selector="answer-0"]`, {
          delay: 300,
        });
        console.log("[LOG]: Answer Chose...", page.url());
        console.log("[LOG]: Waiting for Result...");
        await page.waitForNavigation({ timeout: 30_000 }); // Wait for "/answer/result" (30s)
        if (page.url() !== KahootStep.ANSWER_RESULT)
          return res({ success: false });

        console.log("[LOG]: Waiting Next Question...", page.url());
        await page.waitForNavigation({ timeout: 300_000 }); // Wait next question (5min)

        // No More Question --> Quit
        if (page.url() === KahootStep.RANKING_PAGE)
          return res({ success: true });

        NewQuestion(); // Not finished --> New Question
      };
      NewQuestion();
    } catch (err) {
      console.error(err);
      return res({ success: false });
    }
  });
};

const WriteInput = async (
  page: puppeteer.Page,
  selector: string,
  NewValue: string
): Promise<FunctionJob> => {
  try {
    const KHInput = await page.$(selector);
    if (!KHInput) return { success: false };

    await KHInput.type(NewValue, { delay: 100 });
    if ((await KHInput.getProperty("value"))?._remoteObject?.value !== NewValue)
      return { success: false };

    return { success: true };
  } catch (err) {
    console.error("[No WriteInput]");
    console.error(err);
    return { success: false };
  }
};

const ConnectToGame = async (
  browser: puppeteer.Browser,
  GameID: string,
  Username: string
): Promise<FunctionJob<puppeteer.Page>> => {
  try {
    const page = await browser.newPage();
    await page.goto(KAHOOT_URL);

    const content = await page.content();
    if (EmptyContent(content)) return { success: false };

    const WrCodeSuccess = await WriteInput(page, "#game-input", GameID);
    if (!WrCodeSuccess.success) return { success: false };

    await page.click(`[data-functional-selector="join-game-pin"]`);
    await page.waitForNavigation({ timeout: 2000 });

    console.log(page.url());
    if (page.url() !== KahootStep.USERNAME_PAGE) return { success: false };

    const WrUsernameSuccess = await WriteInput(page, "#nickname", Username);
    if (!WrUsernameSuccess.success) return { success: false };

    await page.click(`[data-functional-selector="join-button-username"]`);
    await page.waitForNavigation({ timeout: 2000 });

    console.log(page.url());
    if (page.url() !== KahootStep.WAITING_PAGE) return { success: false };

    return { success: true, returns: page };
  } catch (err) {
    console.error("[Cannot Connect Game]");
    console.error(err);
    return { success: false };
  }
};
