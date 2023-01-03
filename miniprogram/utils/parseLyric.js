export default function parseLyric(lyricString) {
  const lines = lyricString.split('\n')
  const lyrics = []

  for (let line of lines) {
    const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
    const results = timeReg.exec(line)
    if (!results) continue

    const time1 = Number(results[1]) * 60 * 1000
    const time2 = Number(results[2]) * 1000
    const time3 =
      results[3].length === 3 ? Number(results[3]) : Number(results[3]) * 10
    const lineTime = time1 + time2 + time3

    const text = line.replace(timeReg, '')
    lyrics.push({ lineTime, text })
  }

  return lyrics
}
