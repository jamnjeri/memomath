import { useContext } from "react";
import { GameContext } from "../contexts/GameContextData";

export const useGame = () => useContext(GameContext);