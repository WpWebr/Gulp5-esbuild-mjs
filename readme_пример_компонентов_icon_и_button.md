# Пример компонентов: `icon` и `button`

Этот документ показывает **полный рабочий пример** двух компонентов с зависимостями:

- `icon` — базовый визуальный компонент
- `button` — компонент, зависящий от `icon`

Пример соответствует текущей архитектуре сборки (Gulp + esbuild + компонентный подход + БЭМ).

---

## 1. Структура файлов

```
components/
├─ icon/
│  ├─ icon.html
│  ├─ icon.scss
│  ├─ icon.js
│  └─ icon.md
│
└─ button/
   ├─ button.html
   ├─ button.scss
   ├─ button.js
   └─ button.md
```

---

## 2. Компонент `icon`

### 2.1 icon.html

```html
<span class="icon icon--search" aria-hidden="true"></span>
```

---

### 2.2 icon.scss

```scss
@use "base/variables" as v;

.icon {
  display: inline-block;
  width: v.$icon-size;
  height: v.$icon-size;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.icon--search {
  background-image: url("../img/icons/search.svg");
}
```

**Зависимости SCSS:**
- `base/variables` (инфраструктура, не документируется)

---

### 2.3 icon.js

```js
export default function initIcon(root) {
  if (!root) return;

  // В данном компоненте JS-логика минимальна
  // Файл существует для единообразия архитектуры
}
```

---

### 2.4 icon.md

```md
# icon

## Описание
Иконка интерфейса. Используется внутри других компонентов.

## Зависимости
(нет)

## SCSS
- использует base/variables

## JS
- init: true
- lazy: false
```

---

## 3. Компонент `button`

### 3.1 button.html

```html
<button class="button button--primary">
  <span class="button__icon">
    {{> icon }}
  </span>
  <span class="button__text">Поиск</span>
</button>
```

> Вставка `icon` может быть реализована через include, partial или вручную — в зависимости от HTML-процессора.

---

### 3.2 button.scss

```scss
@use "base/variables" as v;
@use "base/mixins" as m;

@use "../icon/icon";

.button {
  display: inline-flex;
  align-items: center;
  gap: v.$gap-sm;
  padding: v.$btn-padding;
  font-size: v.$font-size-base;
  border: none;
  cursor: pointer;
}

.button__icon {
  display: inline-flex;
}

.button--primary {
  background-color: v.$color-primary;
  color: v.$color-white;
}
```

**SCSS-зависимости:**
- `icon` (компонент)
- `base/variables`, `base/mixins` (инфраструктура)

---

### 3.3 button.js

```js
import initIcon from '../icon/icon.js';

export default function initButton(root) {
  if (!root) return;

  const icons = root.querySelectorAll('.icon');

  icons.forEach(icon => {
    initIcon(icon);
  });
}
```

**JS-зависимости:**
- `icon`

---

### 3.4 button.md

```md
# button

## Описание
Кнопка интерфейса с иконкой и текстом.

## Зависимости
- icon

## SCSS
- использует base/variables
- использует base/mixins

## JS
- init: true
- lazy: auto
```

---

## 4. Использование на странице

### 4.1 page.html

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Пример компонентов</title>
</head>
<body>

  <div class="page">
    {{> button }}
  </div>

</body>
</html>
```

---

## 5. Что проверяет сборка

### SCSS

- `button.scss` → использует `icon` → ✔ описан в `button.md`
- `base/*` → ✔ игнорируются

### JS

- `button.js` импортирует `icon` → ✔ описан в `button.md`

### Документация

- оба компонента имеют `.md`
- зависимости согласованы

---

## 6. Ключевые принципы

- Компонент = папка
- Зависимости описываются **один раз** — в `.md`
- SCSS и JS обязаны соответствовать документации
- `base/*` — инфраструктура, не компонент

---

## Итог

Этот пример демонстрирует эталонный компонент:
- предсказуемую структуру
- явные зависимости
- согласованную документацию
- корректную работу сборки

Используйте его как шаблон для новых компонентов.

