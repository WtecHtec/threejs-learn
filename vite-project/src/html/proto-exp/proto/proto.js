/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/light");

var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))
.addJSON({
  userpackage: {
    nested: {
      User: {
        fields: {
          name: {
            type: "string",
            id: 1
          },
          age: {
            type: "int64",
            id: 2
          }
        }
      }
    }
  }
});


export default $root;
// module.exports = $root;
