import puppeteer from "puppeteer";
import type { FunctionJob } from "./interfaces/interfaces";
import { KAHOOT_URL } from "./globals";
import { EmptyContent, log, logBot, logError, logWarn } from "./Utils/utils";
import { KahootStep } from "./interfaces/enums";

export const LauchKahootBot = async (
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
    const { success: GameFinishedSuccessfully } = await WatchDogGame(
      page,
      GameID
    );
    if (!GameFinishedSuccessfully) return { success: false };

    /* Game Finished: Quit */
    await browser.close();
    return { success: true };
  } catch (err) {
    logError(err as string);
    return { success: false };
  }
};

/* HELPERS */
const WatchDogGame = (
  page: puppeteer.Page,
  GameID: string
): Promise<FunctionJob> => {
  return new Promise(async (res) => {
    try {
      logBot("[LOG]: Waiting for game to start...", GameID);
      await page.waitForNavigation({ timeout: 300_000 }); // Wait 5min for change, if no: quit
      if (page.url() !== KahootStep.STARTING) return res({ success: false });
      logBot("[LOG]: Waiting first question...", GameID);
      await page.waitForNavigation({ timeout: 15_000 }); // Wait for 1st question (15s)

      const NewQuestion = async () => {
        if (page.url() !== KahootStep.GET_READY) return res({ success: false });
        logBot(`[LOG]: Waiting answer options... ${page.url()}`, GameID);

        await page.waitForNavigation({ timeout: 10_000 }); // Wait for question's answers to display (10s)
        if (page.url() !== KahootStep.ANSWER_CHOOSE)
          return res({ success: false });

        try {
          // Choose answer randomly
          const Answer1BtnSelector = `[data-functional-selector="answer-0"]`;
          await page.click(Answer1BtnSelector, { delay: 250 });
          // If Question was a multi-select
          const MultiBtnSelector = `[data-functional-selector="multi-select-submit-button"]`;
          await page.click(MultiBtnSelector, { delay: 100 });
        } catch (err) {}

        logBot(`[LOG]: Answer Chose...  ${page.url()}`, GameID);
        if (page.url() !== KahootStep.ANSWER_RESULT) {
          logBot("[LOG]: Waiting for Result...", GameID);
          await page.waitForNavigation({ timeout: 60_100 }); // Wait for "/answer/result" (1min)
          if (page.url() !== KahootStep.ANSWER_RESULT)
            return res({ success: false });
        } else logWarn("[LOG]: Question Skipped...");

        logBot(`[LOG]: Waiting Next Question... ${page.url()}`, GameID);
        await page.waitForNavigation({ timeout: 300_000 }); // Wait next question (5min)

        // No More Question --> Quit
        if (page.url() === KahootStep.RANKING_PAGE) {
          logBot("[LOG]: Kahoot finished, disconnecting from game...", GameID);
          return res({ success: true });
        }

        NewQuestion(); // Not finished --> New Question
      };
      NewQuestion();
    } catch (err) {
      logError("[WatchDog Error]");
      logError(err as string);
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
    logError("[No WriteInput]");
    logError(err as string);
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

    if (page.url() !== KahootStep.USERNAME_PAGE) return { success: false };
    log(`[LOG] GameID linked: ${page.url()}`);

    const WrUsernameSuccess = await WriteInput(page, "#nickname", Username);
    if (!WrUsernameSuccess.success) return { success: false };

    await page.click(`[data-functional-selector="join-button-username"]`);
    await page.waitForNavigation({ timeout: 2000 });

    logBot(`[LOG] Connected to Game: ${page.url()}`, GameID);
    if (page.url() !== KahootStep.WAITING_PAGE) return { success: false };

    return { success: true, returns: page };
  } catch (err) {
    logError("[Cannot Connect Game]");
    logError(err as string);
    return { success: false };
  }
};

const InitBrowser = async (): Promise<puppeteer.Browser | undefined> => {
  try {
    return await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      executablePath: "/usr/bin/chromium-browser",
      args: [
        "--incognito",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        // "--no-zygote",
        // "--single-process",
      ],
    });
  } catch (err) {
    logError("[No Browser]");
    logError(err as string);
    return undefined;
  }
};
