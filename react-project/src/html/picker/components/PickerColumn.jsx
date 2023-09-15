import React, { useEffect, useRef, useCallback } from 'react'
import ZScroller from 'zscroller'
import '../style/picker-column.css'


export default function PickerColumn({ index, data, value, onValueChange }) {
  let zscroller = null
  let itemHeight = 0

  const indicator = useRef()
  const contentRef = useRef()

  // const indicator = React.createRef();
  // const contentRef = React.createRef();
  useEffect(() => {
    console.log('indicator===', indicator)
    // getBoundingClientRect js原生方法
    // 根据变量判断dom是否渲染完毕
    itemHeight = indicator.current.getBoundingClientRect().height;
    console.log('itemHeight----', itemHeight)
    if (itemHeight !== 0) {
      // 绑定事件
      bindScrollEvent();
      // 列表滚到对应位置
      scrollToPosition();
      return;
    }
    // TODO 这里有个问题 必须要等到渲染结束才能绑定事件 不然获取元素高度有bug 待优化
    window.setTimeout(() => {
      // 绑定事件
      bindScrollEvent();
      // 列表滚到对应位置
      scrollToPosition();
    }, 100);
  }, [])

  // 销毁
  useEffect(() => {
    return () => {
      zscroller.destroy();
    }
  }, [zscroller])

  const bindScrollEvent = () => {
    console.log('绑定滚动的事件', index)
    // 绑定滚动的事件
    // 绑定滚动的事件
    // const content = this.refs.content;

    // getBoundingClientRect js原生方法
    itemHeight = indicator.current.getBoundingClientRect().height;

    // 最后还是用了何一鸣的zscroll插件
    // 但是这个插件并没有太多的文档介绍 gg
    // 插件demo地址：http://yiminghe.me/zscroller/examples/demo.html
    // const t = this;
    console.log('content.current===', contentRef.current.getBoundingClientRect())
    // const content = {
    //   content: contentRef.current.getBoundingClientRect(),
    //   viewport: contentRef.current.getBoundingClientRect(),
    // } 
    const content = contentRef.current
    console.log('e-----', contentRef.current.addEventListener)
    zscroller = new ZScroller(content, {
      scrollbars: false,
      scrollingX: false,
      snapping: true, // 滚动结束之后 滑动对应的位置
      penetrationDeceleration: .1,
      minVelocityToKeepDecelerating: 0.5,
      scrollingComplete() {
        // 滚动结束 回调
        scrollingComplete();
      }
    });
    // zscroller = new ZScroller(content, {
    //   container: contentRef.current,
    //   scrollbars: false,
    //   scrollingX: false,
    //   snapping: true, // 滚动结束之后 滑动对应的位置
    //   penetrationDeceleration: .1,
    //   minVelocityToKeepDecelerating: 0.5,
    //   scrollingComplete() {
    //     // 滚动结束 回调
    //     scrollingComplete();
    //   },
    //   ...content,
    // });


    // 设置每个格子的高度 这样滚动结束 自动滚到对应格子上
    // 单位必须是px 所以要动态取一下
    zscroller.scroller.setSnapSize(0, itemHeight);
  }

  const scrollingComplete = () => {
    // 滚动结束 判断当前选中值
    const { top } = zscroller.scroller.getValues();
    // const { data, value, index, onValueChange } = this.props;
    console.log('itemHeight===', index, itemHeight)
    let currentIndex = top / itemHeight;
    const floor = Math.floor(currentIndex);
    if (currentIndex - floor > 0.5) {
      currentIndex = floor + 1;
    } else {
      currentIndex = floor;
    }

    let selectedValue;

    if (data[currentIndex]) {
      selectedValue = data[currentIndex].value;
    }

    if (selectedValue && selectedValue !== value && typeof onValueChange === 'function') {
      // 值发生变化 通知父组件
      onValueChange(selectedValue, index);
    }
  }
  const scrollToPosition = useCallback(() => {
    // 滚动到选中的位置
    // const {data, value} = this.props;
    for (let i = 0; i < data.length; i++) {
      if (data[i].value === value) {
        selectByIndex(i);
        return;
      }
    }
    selectByIndex(0);
  })
  const selectByIndex = (index) => {
    // 滚动到index对应的位置
    const top = itemHeight * index;
    zscroller.scroller.scrollTo(0, top);
  }
  const getCols = () => {
    // 根据value 和 index 获取到对应的data
    // const {data, value, index, prefixCls} = this.props;
    return data.map((item, i) => (<div key={index + '-' + i} className={`picker-column-col ${data[i].value === value && 'selected'}`}>{data[i].label}</div>));
  }
  const cols = getCols()
  return (
    <div className="picker-column">
      <div className={`picker-column-list`}>
        <div className={`picker-column-window`} />
        <div className={`picker-column-indicator`} ref={indicator} />
        <div className={`picker-column-content`} ref={contentRef}>
          {cols}
        </div>
      </div>
    </div>
  )
}