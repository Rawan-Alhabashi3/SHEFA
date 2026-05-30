export default function range(start, end, step = 1) {
  const output = []
  const from = end == null ? 0 : start
  const to = end == null ? start : end
  if (step === 0) return output

  if (step > 0) {
    for (let value = from; value < to; value += step) output.push(value)
  } else {
    for (let value = from; value > to; value += step) output.push(value)
  }

  return output
}
