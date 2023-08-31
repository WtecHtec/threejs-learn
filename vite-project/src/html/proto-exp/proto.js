/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";
//  import 'protobufjs/light'
// var $protobuf = require("protobufjs/light");
const getDeviceId = async () => {
  const $protobuf = await import("protobufjs/light")
  return $protobuf
}

//async 环境中
var $protobuf = await getDeviceId()

var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))
.addJSON({
  userpackage: {
    nested: {
      User: {
        fields: {
          name: {
            type: "string",
            id: 0
          },
          age: {
            type: "int64",
            id: 1
          }
        }
      }
    }
  }
});

// module.exports = $root;
export default $root;
