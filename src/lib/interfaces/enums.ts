export enum KahootStep {
  HOME = "https://kahoot.it/",
  USERNAME_PAGE = "https://kahoot.it/join",
  WAITING_PAGE = "https://kahoot.it/instructions",
  STARTING = "https://kahoot.it/start",
  GET_READY = "https://kahoot.it/getready",
  ANSWER_CHOOSE = "https://kahoot.it/gameblock",
  ANSWER_SENT = "https://kahoot.it/answer/sent",
  ANSWER_RESULT = "https://kahoot.it/answer/result",
  RANKING_PAGE = "https://kahoot.it/ranking",
}

// On START:
// 1. /start
// 2. /getready
// 3. /gameblock
// 4. /answer/sent
// 5. /answer/result
// 6. --> Return to step 2.
// 7. /ranking

export enum LogColors {
  Reset = "\x1b[0m",
  Bright = "\x1b[1m",
  Dim = "\x1b[2m",
  Underscore = "\x1b[4m",
  Blink = "\x1b[5m",
  Reverse = "\x1b[7m",
  Hidden = "\x1b[8m",

  FgBlack = "\x1b[30m",
  FgRed = "\x1b[31m",
  FgGreen = "\x1b[32m",
  FgYellow = "\x1b[33m",
  FgBlue = "\x1b[34m",
  FgMagenta = "\x1b[35m",
  FgCyan = "\x1b[36m",
  FgWhite = "\x1b[37m",

  BgBlack = "\x1b[40m",
  BgRed = "\x1b[41m",
  BgGreen = "\x1b[42m",
  BgYellow = "\x1b[43m",
  BgBlue = "\x1b[44m",
  BgMagenta = "\x1b[45m",
  BgCyan = "\x1b[46m",
  BgWhite = "\x1b[47m",
}
