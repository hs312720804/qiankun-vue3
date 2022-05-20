export function toBtnConfig (item) {
  const _items = item.split(':')
  return {
    label: _items[0] || '',
    type: _items[1] || '',
    methodName: _items[2] || '',
    model: _items[3] || '',
    rule: _items[4] || '',
    powerCode: _items[5] || ''
  }
}
