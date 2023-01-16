export default function stringToNodes(keyword, value) {
  const nodes = []
  if (keyword.toUpperCase().startsWith(value.toUpperCase())) {
    const matchKeyword = keyword.slice(0, value.length)
    const matchNode = {
      name: 'span',
      attrs: { style: 'color: #fe231e;' },
      children: [{ type: 'text', text: matchKeyword }]
    }
    nodes.push(matchNode)

    const restKeyword = keyword.slice(value.length)
    const restNode = {
      name: 'span',
      attrs: { style: 'color: #333;' },
      children: [{ type: 'text', text: restKeyword }]
    }
    nodes.push(restNode)
  } else {
    const node = {
      name: 'span',
      attrs: { style: 'color: #333;' },
      children: [{ type: 'text', text: keyword }]
    }
    nodes.push(node)
  }
  return nodes
}
