export function clean() {
  return add.plugins.deleteAsync(add.paths.dest, { force: true });
}
// удаление спрайта
export function cleanSprite() {
  return add.plugins.deleteAsync(add.paths.svg.sprite, { force: true });
}