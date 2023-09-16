/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';

import PickerColumn from './PickerColumn'

import '../style/picker-view.css'


// 递归寻找value
function getNewValue(tree, oldValue, newValue, deep) {
	// 遍历tree
	let has;

	tree.map((item, i) => {
		if (item.value === oldValue[deep]) {
			newValue.push(item.value);
			has = i;
		}
	});

	if (has === undefined) {
		has = 0;
		newValue.push(tree[has].value);
	}

	if (tree[has].children) getNewValue(tree[has].children, oldValue, newValue, deep + 1);

	return newValue;
}

// 根据value找索引
function getColumnsData(tree, value, hasFind, deep) {
	// 遍历tree
	let has;
	const array = [];

	tree.map((item, i) => {
		array.push({ label: item.label, value: item.value });
		if (item.value === value[deep]) has = i;
	});

	// 判断有没有找到
	// 没找到return
	// 找到了 没有下一集 也return
	// 有下一级 则递归
	if (has === undefined) return hasFind;

	hasFind.push(array);

	if (tree[has].children) getColumnsData(tree[has].children, value, hasFind, deep + 1);

	return hasFind;
}


/**
 * 
 * @param {*} param0 
 * col 
 * data
 * value  默认值(配合 controlled 使用)
 * cascade 级联状态
 * controlled 受控组件
 * @returns 
 */
const PickerView = ({ data, controlled, value, onChange, cascade = true, col = 1 }) => {
	const [defaultSelectedValue, setDefaultSelectedValue] = useState([])

	useEffect(() => {
		if (!controlled) setDefaultSelectedValue(value);
	}, [controlled, value])



	const handleValueChange = (newValue, index) => {
		// 子组件column发生变化的回调函数
		// 每次值发生变化 都要判断整个值数组的新值
		// const {defaultSelectedValue} = this.state;
		// const {data, cascade, controlled, value, onChange} = this.props;

		if (controlled) {
			// 也要算一下正确的值
			const oldValue = value.slice();
			oldValue[index] = newValue;

			if (typeof onChange !== 'function') return;
			if (cascade) {
				onChange(getNewValue(data, oldValue, [], 0));
			} else {
				onChange(oldValue);
			}


			return;
		}

		const oldValue = defaultSelectedValue.slice();
		oldValue[index] = newValue;
		console.log('newValue, index ---', data, oldValue, newValue, index)
		if (cascade) {
			// 如果级联的情况下
			const newState = getNewValue(data, oldValue, [], 0);
			console.log('newState---', newState)
			// this.setState({defaultSelectedValue: newState});
			setDefaultSelectedValue(() => [...newState])
			onChange(newState);
		} else {
			// 不级联 单纯改对应数据
			if (!controlled) {
				// this.setState({defaultSelectedValue: oldValue});
				setDefaultSelectedValue(() => [...oldValue])
			}

			onChange(oldValue);
		}
	}

	const getColumns = () => {
		// const {col, data, cascade, value, controlled} = this.props;
		// const {defaultSelectedValue} = this.state;
		const result = [];

		if (controlled) {
			if (value.length === 0) return;
		} else {
			if (defaultSelectedValue.length === 0) return;
		}

		let array;

		if (cascade) {
			if (controlled) {
				array = getColumnsData(data, value, [], 0);
			} else {
				array = getColumnsData(data, defaultSelectedValue, [], 0);
			}
		} else {
			array = data;
		}
		console.log('------- array', array)
		for (let i = 0; i < col; i++) {
			result.push(
				<PickerColumn
					key={i}
					index={i}
					value={controlled ? value[i] : defaultSelectedValue[i]}
					data={array[i]}
					onValueChange={handleValueChange}
				/>
			);
		}

		return result;
	}
	const columns = getColumns();
	console.log('picker views')
	return (
		<div className="picker-view">
			{columns}
		</div>
	)
}

export default PickerView