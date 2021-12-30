import { GameStatus, Message } from "../../metadata/types";

// Deteriorated design, bare with us
export default interface MessageQueue {
  pushMessage(m: Message): void;
  endMission(gameStatus: GameStatus): void;
}
