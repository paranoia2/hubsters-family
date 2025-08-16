import { Events } from 'discord.js';
export default {
  name: Events.InteractionCreate,
  async execute(interaction){
    if(!interaction.isButton()) return;
    if(!interaction.customId.startsWith('selfrole:')) return;
    const roleId = interaction.customId.split(':')[1];
    const member = await interaction.guild.members.fetch(interaction.user.id);
    if(member.roles.cache.has(roleId)){ await member.roles.remove(roleId); await interaction.reply({ content:'🗑️ Роль знято', ephemeral:true }); }
    else { await member.roles.add(roleId); await interaction.reply({ content:'✅ Роль видано', ephemeral:true }); }
  }
};
