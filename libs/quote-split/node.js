/**
 * This function splits a string into words, but preserves substring delimited by quotes
 * @example quoteSplit('abc def "ghi jkl" mno') -> ['abc', 'def', 'ghi jkl', 'mno']
 * @param str {string} input string
 * @return {string[]} output array
 */
module.exports = function quoteSplit (str) {
  const s = str.match(/(?:[^\s"]+|"[^"]*")+/g)
  return s
    ? s.map(s => s
      .replace(/^"/, '')
      .replace(/"$/, '')
    )
    : str
}
