import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
export default { data: new SlashCommandBuilder().setName('purge').setDescription('Видалити N повідомлень')
.addIntegerOption(o=>o.setName('amount').setDescription('1..100').setMinValue(1).setMaxValue(100).setRequired(true))
.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
async execute(interaction){ const amount=interaction.options.getInteger('amount',true); await interaction.deferReply({ephemeral:true}); const deleted=await interaction.channel.bulkDelete(amount,true).catch(()=>null); if(!deleted) return interaction.editReply('⚠️ Не вдалося'); await interaction.editReply(`🧹 Видалено ${deleted.size}`);} };
