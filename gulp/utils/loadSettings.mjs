import { setings as defaultSetings } from '../setings/setings.mjs';

export async function loadSettings(projectSettingsPath) {
  let projectSetings = {};

  if (projectSettingsPath && add.plugins.fs.existsSync(projectSettingsPath)) {
    try {
      // Получаем абсолютный путь
      const fullPath = add.plugins.path.resolve(projectSettingsPath);

      // Конвертируем Windows-путь в file:// URL
      const fileUrl = add.plugins.pathToFileURL(fullPath).href;

      // Динамический импорт теперь работает на Windows
      const imported = await import(fileUrl);

      projectSetings = imported.setings || {};
    } catch (e) {
      console.error('Ошибка при загрузке файла настроек проекта:', e);
    }
  }

  return {
    ...defaultSetings,
    ...projectSetings
  };
}
