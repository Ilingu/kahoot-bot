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