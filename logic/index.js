const replace = (text, toReplace, withThis) => {
  const regex = new RegExp(toReplace, 'g')
  return text.replace(regex, withThis)
};

module.exports = replace;
