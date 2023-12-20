// add-id-plugin.js
import { nanoid } from 'nanoid'
// const posthtml = require('posthtml');
import posthtml   from 'posthtml'
import { parse, compileScript, compileTemplate, rewriteDefault, compileStyle } from "@vue/compiler-sfc";

function addId(tree) {
  tree.match({ attrs: { 'data-point-id': false } }, node => {
    node.attrs['data-point-id'] = `id-${nanoid(8)}`;
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
    // async  transformIndexHtml(html) {
    //   // 这里利用 posthtml 的能力
    //   const inlineHtml = await posthtml()
    //     .use((tree) => addId(tree))
    //     .process(html, { sync: true }).html;
    //   return inlineHtml
    // }
    async transform(code, id) {
      console.log('transform----', id)

      if (/\.vue$/.test(id)) {
        console.log('code---', code)
        const {descriptor} = parse(code);
        console.log(descriptor)
        const html = descriptor?.template?.content
        let newCode = ''
        if (html) {
          newCode = `<template>`
          const inlineHtml = await posthtml()
            .use((tree) => addId(tree))
            .process(html, { sync: true }).html;
   
          newCode = `${newCode}${inlineHtml}</template>`
          if (descriptor?.scriptSetup?.content) {
            newCode = `${newCode}<script setup> ${descriptor?.scriptSetup?.content}</script>`
          }
          if (Array.isArray(descriptor?.styles)) {
            const styles = descriptor?.styles
            styles.forEach(({content,  scoped}) => {
              newCode = `${newCode}<style ${ scoped ? 'scoped' : ''}>${content}</style>`
            })
          }
          console.log( newCode )
          return {
            code: newCode,
            id,
          }
        }
        
      }
    }
  }
};

export default addIdPlugin