let plugins = async (m, { sock, command, isOwner, mess }) => {
  if (!isOwner) return m.reply(mess.owner);
  if (/public/.test(command)) {
    sock.public = true;
    await m.reply("Bot di atur ke publik");
  } else if (/self/.test(command)) {
    sock.public = false;
    await m.reply("Bot di atur ke self");
  }
};

plugins.cmd = ["public", "self"];
plugins.description = "Ubah mode bot";
plugins.help = ["self", "public"];
plugins.execute = plugins;
module.exports = plugins;
