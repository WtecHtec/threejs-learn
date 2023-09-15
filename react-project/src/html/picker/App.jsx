

import PickerView from './components/PickerView/'
const array1 = [
  {label: '水果', value: 'fruit', children: [
      {label: '苹果', value: 'apple'},
      {label: '香蕉', value: 'banana'},
      {label: '橘子', value: 'orange'},
      {label: '西瓜', value: 'watermelon'}
  ]},
  {label: '蔬菜', value: 'vegetables', children: [
      {label: '番茄', value: 'tomato'},
      {label: '土豆', value: 'potato'},
      {label: '白菜', value: 'cabbage'}
  ]},
  {label: '动物', value: 'animal', children: [
      {label: '皮皮虾', value: 'shrimp'},
      {label: '象拔蚌', value: 'clam'},
      {label: '骚猪', value: 'pdd'}
  ]},
];

const value1 = ['fruit', 'watermelon']

export default function Experience() { 
  const handleChange = (newValue) => {
    console.log('首页 handleChange===  ', newValue)
  }

  return <div>CES

    <PickerView  
      col={2}
      data={array1}
      value={value1}
      onChange={handleChange}></PickerView>
  </div>
}