const fs = require('fs');
const path = require('path');
const syntaxerror = require('syntax-error');

const pluginFolder = path.join(__dirname, '../../handler/plugins');
const pluginFilter = (filename) => filename.endsWith('.js');
const pluginCache = new Map(); 

exports.pluginsLoader = async (conn) => {
  global.plugins = {};

  const loadPluginsFromFolder = (folderPath, category = 'uncategorized') => {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        loadPluginsFromFolder(filePath, file); 
      } else if (pluginFilter(file)) {
        try {
          pluginCache.set(file, stats.mtimeMs);
          if (!global.plugins[category]) global.plugins[category] = {};
          global.plugins[category][file] = require(filePath);
        } catch (e) {
          conn.logger.error(e);
          if (global.plugins[category]) delete global.plugins[category][file];
        }
      }
    }
  };

  loadPluginsFromFolder(pluginFolder);
  //console.log(global.plugins);

  global.reload = (_event, filename) => {
    const checkAndReload = (folderPath, category = 'uncategorized') => {
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
          checkAndReload(filePath, file);
        } else if (pluginFilter(file)) {
          const lastModified = pluginCache.get(file) || 0;
          if (stats.mtimeMs !== lastModified) {
            pluginCache.set(file, stats.mtimeMs);
            if (require.cache[filePath]) {
              delete require.cache[filePath];
              conn.logger.info(`Reloading plugin '${file}' in category '${category}'`);
            } else {
              conn.logger.info(`Loading new plugin '${file}' in category '${category}'`);
            }
            const err = syntaxerror(fs.readFileSync(filePath), file);
            if (err) {
              conn.logger.error(`Syntax error in '${file}':\n${err}`);
            } else {
              try {
                if (!global.plugins[category]) global.plugins[category] = {};
                global.plugins[category][file] = require(filePath);
              } catch (e) {
                conn.logger.error(e);
              }
            }
          }
        }
      }
    };

    checkAndReload(pluginFolder);
  };

  Object.freeze(global.reload);
  fs.watch(pluginFolder, { recursive: true }, (eventType, filename) => {
    if (filename) global.reload(eventType, filename);
  });
};
