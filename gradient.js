import { SlashCommandBuilder, PermissionFlagsBits, Colors } from 'discord.js';

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex({r,g,b}) {
  return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
}

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function makeGradient(startHex, endHex, steps) {
  const a = hexToRgb(startHex);
  const b = hexToRgb(endHex);
  const list = [];
  for (let i = 0; i < steps; i++) {
    const t = steps === 1 ? 0 : i / (steps - 1);
    const r = lerp(a.r, b.r, t);
    const g = lerp(a.g, b.g, t);
    const bch = lerp(a.b, b.b, t);
    list.push(rgbToHex({ r, g, b: bch }));
  }
  return list;
}

export default {
  data: new SlashCommandBuilder()
    .setName('gradient')
    .setDescription('Керування градієнтними ролями (імітація кольорового ніку через ролі)')
    .addSubcommand(sc => sc
      .setName('create-roles')
      .setDescription('Створити набір ролей між двома кольорами')
      .addStringOption(o => o.setName('start_color').setDescription('Початковий колір (#rrggbb)').setRequired(true))
      .addStringOption(o => o.setName('end_color').setDescription('Кінцевий колір (#rrggbb)').setRequired(true))
      .addIntegerOption(o => o.setName('steps').setDescription('Кількість ролей (2-20)').setMinValue(2).setMaxValue(20).setRequired(true))
      .addStringOption(o => o.setName('prefix').setDescription('Префікс назв ролей, напр. GF-').setRequired(true))
    )
    .addSubcommand(sc => sc
      .setName('apply')
      .setDescription('Видати користувачу роль з набору')
      .addUserOption(o => o.setName('user').setDescription('Кому видати').setRequired(true))
      .addStringOption(o => o.setName('role_name').setDescription('Назва ролі з набору').setRequired(true))
    )
    .addSubcommand(sc => sc
      .setName('cleanup')
      .setDescription('Видалити всі ролі з префіксом')
      .addStringOption(o => o.setName('prefix').setDescription('Префікс, напр. GF-').setRequired(true))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === 'create-roles') {
      const start = interaction.options.getString('start_color', true);
      const end = interaction.options.getString('end_color', true);
      const steps = interaction.options.getInteger('steps', true);
      const prefix = interaction.options.getString('prefix', true);

      await interaction.deferReply({ ephemeral: true });
      const colors = makeGradient(start, end, steps);
      const created = [];
      for (let i = 0; i < colors.length; i++) {
        const name = `${prefix}${i+1}`;
        const role = await interaction.guild.roles.create({
          name,
          color: colors[i],
          mentionable: false,
          reason: 'Gradient role set'
        });
        created.push(role.name);
      }
      await interaction.editReply(`✅ Створено ролі: ${created.join(', ')}`);
    } else if (sub === 'apply') {
      const user = interaction.options.getUser('user', true);
      const roleName = interaction.options.getString('role_name', true);
      const role = interaction.guild.roles.cache.find(r => r.name === roleName);
      if (!role) return interaction.reply({ content: '⚠️ Роль не знайдена.', ephemeral: true });
      const member = await interaction.guild.members.fetch(user.id);
      await member.roles.add(role);
      await interaction.reply(`🌈 Додано роль **${role.name}** для <@${member.id}>`);
    } else if (sub === 'cleanup') {
      const prefix = interaction.options.getString('prefix', true);
      await interaction.deferReply({ ephemeral: true });
      const toDelete = interaction.guild.roles.cache.filter(r => r.name.startsWith(prefix));
      for (const role of toDelete.values()) {
        await role.delete('Gradient cleanup');
      }
      await interaction.editReply(`🧹 Видалено ролі з префіксом **${prefix}**: ${toDelete.size}`);
    }
  }
};
