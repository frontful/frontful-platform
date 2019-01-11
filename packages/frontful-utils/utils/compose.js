export function compose(...args) {
  return args.length > 1 ?
    args.shift()(compose(...args)) :
    args[0]
}
