import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { gradientColors } from '../utils/gradient.js';

export default {
  data: new SlashCommandBuilder().setName('gradient').setDescription('Кольорові ролі-градієнт')
    .addSubcommand(sc=>sc.setName('create-roles').setDescription('Створити ролі')
      .addStringOption(o=>o.setName('start_color').setDescription('#ff0000').setRequired(true))
      .addStringOption(o=>o.setName('end_color').setDescription('#0000ff').setRequired(true))
      .addIntegerOption(o=>o.setName('steps').setDescription('2..20').setMinValue(2).setMaxValue(20).setRequired(true))
      .addStringOption(o=>o.setName('prefix').setDescription('Префікс').setRequired(true)))
    .addSubcommand(sc=>sc.setName('apply').setDescription('Видати одну з кольорових ролей')
      .addUserOption(o=>o.setName('user').setDescription('Кому').setRequired(true))
      .addStringOption(o=>o.setName('role_name').setDescription('Назва ролі').setRequired(true)))
    .addSubcommand(sc=>sc.setName('cleanup').setDescription('Видалити всі ролі з префіксом')
      .addStringOption(o=>o.setName('prefix').setDescription('Префікс').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction){
    const sub = interaction.options.getSubcommand();
    if (sub === 'create-roles') {
      const start = interaction.options.getString('start_color',true);
      const end = interaction.options.getString('end_color',true);
      const steps = interaction.options.getInteger('steps',true);
      const prefix = interaction.options.getString('prefix',true);
      const colors = gradientColors(start,end,steps);
      await interaction.deferReply({ ephemeral: true });
      for (let i=0;i<colors.length;i++){
        await interaction.guild.roles.create({ name: `${prefix}${i+1}`, color: colors[i], reason: 'gradient roles' }).catch(()=>{});
      }
      await interaction.editReply(`✅ Створено ${colors.length} ролей з префіксом **${prefix}**`);
    } else if (sub === 'apply') {
      const user = interaction.options.getUser('user',true);
      const roleName = interaction.options.getString('role_name',true);
      const member = await interaction.guild.members.fetch(user.id);
      const role = interaction.guild.roles.cache.find(r=>r.name === roleName);
      if(!role) return interaction.reply({ content:'Не знайдено роль', ephemeral:true });
      await member.roles.add(role).catch(()=>{});
      await interaction.reply(`🎨 Видано роль **${role.name}** для <@${member.id}>`);
    } else {
      const prefix = interaction.options.getString('prefix',true);
      const toDelete = interaction.guild.roles.cache.filter(r=>r.name.startsWith(prefix));
      for (const r of toDelete.values()){ await r.delete('gradient cleanup').catch(()=>{}); }
      await interaction.reply(`🧹 Видалено ${toDelete.size} ролей`);
    }
  }
};
