// Regular expression to match shortcode attributes
let SHORTCODE_ATTRS =
  /(\s+([a-z0-9\-_]+|([a-z0-9\-_]+)\s*=\s*([a-z0-9\-_]+|\d+\.\d+|'[^']*'|"[^"]*")))*/
    .toString()
    .slice(1, -1);

// Regular expression for matching optional slashes in shortcode
let SHORTCODE_SLASH = /\s*\/?\s*/.toString().slice(1, -1);

// Regular expression for matching shortcode opening tags
let SHORTCODE_OPEN = /\[\s*%s/.toString().slice(1, -1);

// String for representing the right bracket in shortcode
let SHORTCODE_RIGHT_BRACKET = "\\]";

// Regular expression for matching shortcode closing tags
let SHORTCODE_CLOSE = /\[\s*\/\s*%s\s*\]/.toString().slice(1, -1);

// Regular expression for matching shortcode content
let SHORTCODE_CONTENT = /(.|\n|)*?/.toString().slice(1, -1);

// Regular expression for matching whitespace in shortcode
let SHORTCODE_SPACE = /\s*/.toString().slice(1, -1);

// Definition of the ShortCode object
const ShortCode = {
  // Method to add a shortcode
  add: function (name, callback) {
    if (typeof name == "object") {
      // If the name is an object, iterate over the properties and add the methods to the ShortCode object
      var ob = name;
      Object.keys(ob).forEach(function (m) {
        // Add the methods from the object to the ShortCode object
        if (typeof ob[m] === "function") {
          ShortCode[m] = ob[m];
        }
      });
    } else {
      // If the name is not an object, add the shortcode with the name and callback function to the ShortCode object
      ShortCode[name] = callback;
    }
  },
  // Method to remove a shortcode
  remove: function (name) {
    // Delete the shortcode from the ShortCode object
    delete ShortCode[name];
  },
  // Method to parse content for shortcodes
  parse: function (buf, extra, context) {
    context = context || ShortCode;
    extra = extra || {};
    Object.keys(context).forEach(function (name) {
      // Allow the absence of the first character if it's not alphanumeric. Example: [#shortcode]...[/shortcode]
      var regex = {
        wrapper: new RegExp(
          format(SHORTCODE_OPEN, name) +
            SHORTCODE_ATTRS +
            SHORTCODE_RIGHT_BRACKET +
            SHORTCODE_CONTENT +
            format(SHORTCODE_CLOSE, closeTagString(name)),
          "gi"
        ),
        inline: new RegExp(
          format(SHORTCODE_OPEN, name) +
            SHORTCODE_ATTRS +
            SHORTCODE_SLASH +
            SHORTCODE_RIGHT_BRACKET,
          "gi"
        ),
      };
      var matches = buf.match(regex.wrapper);
      if (matches) {
        matches.forEach(function (m) {
          var data = parseShortcode(name, m);
          buf = buf.replace(
            m,
            context[name].call(null, data.content, data.attr, extra)
          );
        });
      }
      matches = buf.match(regex.inline);
      if (matches) {
        matches.forEach(function (m) {
          var data = parseShortcode(name, m, true);
          buf = buf.replace(
            m,
            context[name].call(null, data.content, data.attr, extra)
          );
        });
      }
    });
    return buf;
  },
  // Method to parse content in a specific context
  parseInContext: function (buf, context, data) {
    return this.parse(buf, data, context);
  },
};

// Return the modified and commented ShortCode object

// Function to typecast a value
function typecast(val) {
  // Remove leading and trailing whitespace
  val = val.trim().replace(/(^['"]|['"]$)/g, "");

  // Check if the value is an integer
  if (/^\d+$/.test(val)) {
    return +val; // Convert to a number using the unary operator +
  }
  // Check if the value is a decimal number
  else if (/^\d+\.\d+$/.test(val)) {
    return +val; // Convert to a number using the unary operator +
  }
  // Check if the value is "true" or "false"
  else if (val === "true" || val === "false") {
    return val === "true"; // Convert to a boolean
  }
  // Check if the value is "undefined"
  else if (val === "undefined") {
    return undefined; // Return the undefined value
  }
  // Check if the value is "null"
  else if (val === "null") {
    return null; // Return the null value
  }
  // If none of the above conditions are met, return the value unchanged
  else {
    return val;
  }
}

// This function returns a closing tag string.
function closeTagString(name) {
  // Check if the first character is not a lowercase letter or digit.
  if (!isLowerCaseOrDigit(name[0])) {
    // If it's not a lowercase letter or digit, format the string with the first character escaped and the rest of the string unchanged.
    return format("[%s]?%s", escapeSpecialCharacter(name[0]), name.slice(1));
  } else {
    // If it's a lowercase letter or digit, return the string unchanged.
    return name;
  }
}

// This function checks if a character is a lowercase letter or digit.
function isLowerCaseOrDigit(char) {
  // Use a regular expression to check if the character is a lowercase letter or digit.
  return /[a-z0-9]/.test(char);
}

// This function escapes a special character.
function escapeSpecialCharacter(char) {
  // Replace the special character "$" with "\\$" to escape it.
  return char.replace("$", "\\$");
}

/**
 * Parse a shortcode.
 *
 * @param {string} name - The name of the shortcode.
 * @param {string} buf - The input string to parse.
 * @param {boolean} inline - Whether the shortcode is inline or not.
 * @returns {object} - An object containing the parsed attributes and content of the shortcode.
 */
function parseShortcode(name, buf, inline) {
  // Initialize variables
  var regex,
    match,
    data = {},
    attr = {};

  // Set the regular expression based on whether the shortcode is inline or not
  if (inline) {
    regex = new RegExp(
      "^" +
        format(SHORTCODE_OPEN, name) +
        SHORTCODE_ATTRS +
        SHORTCODE_SPACE +
        SHORTCODE_SLASH +
        SHORTCODE_RIGHT_BRACKET,
      "i"
    );
  } else {
    regex = new RegExp(
      "^" +
        format(SHORTCODE_OPEN, name) +
        SHORTCODE_ATTRS +
        SHORTCODE_SPACE +
        SHORTCODE_RIGHT_BRACKET,
      "i"
    );
  }

  // Loop through the input string and match the regex
  while ((match = buf.match(regex)) !== null) {
    var key = match[3] || match[2]; // Get the attribute key
    var val = match[4] || match[3]; // Get the attribute value
    var pattern = match[1]; // Get the pattern

    if (pattern) {
      var idx = buf.lastIndexOf(pattern); // Find the last occurrence of the pattern
      attr[key] = val !== undefined ? typecast(val) : true; // Set the attribute value
      buf = buf.slice(0, idx) + buf.slice(idx + pattern.length); // Remove the pattern from the buffer
    } else {
      break; // Stop the loop if there is no pattern
    }
  }

  // Reverse the order of the attributes and convert them into an object
  attr = Object.keys(attr)
    .reverse()
    .reduce(function (prev, current) {
      prev[current] = attr[current];
      return prev;
    }, {});

  // Remove the shortcode tags from the buffer
  buf = buf
    .replace(regex, "")
    .replace(new RegExp(format(SHORTCODE_CLOSE, closeTagString(name))), "");

  // Return the parsed attributes and content
  return {
    attr: attr,
    content: inline ? buf : buf.replace(/(^\n|\n$)/g, ""),
  };
}

// Regular expression to search for conversion specifiers in the format string
const formatRegExp = /%[sdj%]/g;

/**
 * Takes a format string and a variable number of arguments and returns
 * a string with the argument values replacing the conversion specifiers in the format string.
 * @param {string} f The format string
 * @param {...*} arguments The arguments
 * @returns {string} The formatted text string
 */
function format(f) {
  // If the format string is not a string, convert each argument to a string
  if (typeof f !== "string") {
    const objects = [];
    for (let i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(" ");
  }

  // Initialize indices and arguments
  let i = 1;
  const args = arguments;
  const len = args.length;

  // Replace conversion specifiers in the format string with corresponding values
  let str = String(f).replace(formatRegExp, function (x) {
    if (x === "%%") return "%";
    if (i >= len) return x;
    switch (x) {
      case "%s":
        return String(args[i++]);
      case "%d":
        return Number(args[i++]);
      case "%j":
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return "[Circular]";
        }
      default:
        return x;
    }
  });

  // Add additional arguments to the text string
  for (let x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += " " + x;
    } else {
      str += " " + inspect(x);
    }
  }

  // Return the formatted text string
  return str;
}

export default ShortCode;
