<script setup>
import { onMounted } from 'vue'
import protobuf from 'protobufjs'
// import  protoRoot from './proto/proto.js'
const protoRoot =  require('./proto/proto')
import './style.css';
import httpService from '@/utils/request'
onMounted(() => {
  // httpService.get('/minixr/testpb').then(res => { 
  //   console.log(res.data)
  
  //   const buf =  protobuf.util.newBuffer(res.data)
  //   console.log('buf====', buf)
  //   const User = protoRoot.lookupType('userpackage.User');
  //   // decode响应体
  //   const decodedResponse = User.decode(buf)
  //   console.log('decodedResponse====', decodedResponse)
  // }).catch(err => console.error(err))
  const doc = { name: 'Bill', age: 30 };
  const User = protoRoot.lookupType('userpackage.User');
  console.log('User.encode(doc).finish()====',  protobuf.util.newBuffer(User.encode(doc).finish()), )
  httpService.post( '/minixr/testpb', protobuf.util.newBuffer(User.encode( User.create(doc)).finish()), ).then(res => { 
    console.log(res.data)
  
    const buf =  protobuf.util.newBuffer(res.data)
    console.log('buf====', buf)
    const User = protoRoot.lookupType('userpackage.User');
    // decode响应体
    const decodedResponse = User.decode(buf)
    console.log('decodedResponse====', decodedResponse)
  }).catch(err => console.error(err))


})
</script>

<template>

</template>
