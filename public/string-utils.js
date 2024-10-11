//@TODO: make this util file project-wide
const stringUtils = {
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

  validateEmail: (email) => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { valid: true, message: 'Email is valid' };
    return { valid: false, message: 'Please enter a valid email' };
  },

  validatePasswords: (password1, password2) => {
    if (password1 !== password2) return { valid: false, message: 'Passwords do not match' };
    if (password1.length < 8) return { valid: false, message: 'Passwords must be at least 8 characters' };
    if (!/[A-Z]/.test(password1)) return { valid: false, message: 'Passwords must contain at least one uppercase letter' };
    if (!/[a-z]/.test(password1)) return { valid: false, message: 'Password must contain at least one lowercase letter' };
    if (!/\d/.test(password1)) return { valid: false, message: 'Password must contain at least one number' };
    return { valid: true, message: 'Password is valid' };
  }
}