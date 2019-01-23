export default function mergeMaps(maps) {
  return new Map(function* () {
    for (let i = 0, l = maps.length; i < l; i++) {
      yield* maps[i]
    }
  }())
}
