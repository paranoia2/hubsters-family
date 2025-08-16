import { Events, EmbedBuilder } from 'discord.js';
import { getDb } from '../utils/jsondb.js';
export default {
  name: Events.MessageDelete, // we will attach multiple in same file via client.on elsewhere if needed
  async execute(message, client){
    // This file will actually attach in bot as single handler file? Simpler: export multiple not supported by loader; so skip message delete.
  }
};
