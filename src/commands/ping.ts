import { IBotData } from "../Interface/IBotData";

export default async ({reply}: IBotData) => {
  await reply("Pong");
};