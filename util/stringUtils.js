export default {
  // Capitalize first word
  capitalize: str => (str && str[0].toUpperCase() + str.slice(1)) || "",

  // String to Title Case (exclude certain words)
  titleCase: (str, glue) => {
    glue = !!glue ? glue : ['of', 'for', 'and', 'a', 'the', 'to'];
    var first = true;
    return str.replace(/(\w)(\w*)/g, function (_, i, r) {
      var j = i.toUpperCase() + (r != null ? r : '').toLowerCase();
      var result = ((glue.indexOf(j.toLowerCase()) < 0) || first) ? j : j.toLowerCase();
      first = false;
      return result;
    });
  },

  formatUsd: (n) => {
    let output = n;
    if (typeof n !== 'number') {
      if (typeof n === 'string') output = parseInt(n, 10);
      throw new Error('formatUsd requires a number or a string that can be parsed into a number');
    }

    output = output.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `$${output}`;
  }
}