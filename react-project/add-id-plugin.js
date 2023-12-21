// add-id-plugin.js
import incstr from 'incstr'
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import t from "@babel/types";
import generate from "@babel/generator";

const  nextId = incstr.idGenerator({alphabet:'abcdefghjklmnopqrstuvwxyz0123456789',  suffix:''})


function addId(tree) {
  tree.match({ attrs: { 'data-point-id': false } }, node => {
    node.attrs['data-point-id'] = `id-${nextId()}`;
    return node;
  });
  return tree;
};
function addIdPlugin() {
  // return function addId(tree) {
  //   tree.match({ attrs: { id: false } }, node => {
  //     node.attrs.id = `id-${nanoid(8)}`;
  //     return node;
  //   });
  //   return tree;
  // };
  return {
    name: 'my-example',
    apply: 'build',
     // 该插件在 plugin-vue 插件之前执行，这样就可以直接解析到原模板文件
     enforce: 'pre',
    // async  transformIndexHtml(html) {
    //   // 这里利用 posthtml 的能力
    //   const inlineHtml = await posthtml()
    //     .use((tree) => addId(tree))
    //     .process(html, { sync: true }).html;
    //   return inlineHtml
    // }
    async transform(code, id) {
      

      if (/\.jsx$/.test(id)) {
        console.log('transform----', id)
        // console.log('code---', code)
        const ast = parse(code,  {
          sourceType: "module",
          plugins: [
            "jsx",
            "flow",
          ],
        })
        // console.log('ast---', ast)
        traverse.default(ast, {
          JSXOpeningElement(path){
            console.log('JSXOpeningElement--- name, attributes, selfClosing')
            console.log(path.node.attributes,)
            
            if (Array.isArray(path.node.attributes)) {
              const jsxAttr = t.jsxAttribute(t.jsxIdentifier('data-points-id'), t.stringLiteral(nextId()));
              path.node.attributes.push(jsxAttr)
            }
          },
          // enter(path) {
          //   if (path.isIdentifier({ name: "n" })) {
          //     path.node.name = "x";
          //   }
          // },
        });
      
        const outcode = generate.default(ast, {
          sourceType: "module",
      
        })
        console.log('outcode----', outcode)
        return {
          code: outcode.code,
          id,
        }
      }
        
    }
    
  }
}

export default addIdPlugin